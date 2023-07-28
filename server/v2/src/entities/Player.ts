/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Game from '../components/Game';
import Entity from '../components/Entity';
import NetworkClient from '../networking/components/Client';
import { EntityState, ItemType, RemoveType } from '../enums';
import { PlayerHandshakeInput } from '../interfaces';
import { isStringEmpty } from '../Utils';
import { Item, ItemStack } from '../components/Item';
import { UpdateUnits } from '../networking/packets/bin/Units';
import Leaderboard from '../networking/packets/bin/Leaderboard';

export class PlayerSkin {
  public bag: number;
  public skin: number;
  public book: number;
  public deadBox: number;
  public lootBox: number;
  public accessory: number;

  constructor(skin: number = 0, accessory: number = 0, bag: number = 0, book: number = 0, lootBox: number = 1, deadBox: number = 0) {
    this.skin = skin;
    this.accessory = accessory;
    this.bag = bag;
    this.book = book;
    this.lootBox = lootBox;
    this.deadBox = deadBox;
  }
}

export class PlayerInventory {
  private player: Player;

  public equippedItem: Item = Item.hand;
  public equippedHelmet: Item = Item.none;
  public items: ItemStack[] = [];

  get size() {
    return false ? 10 : 16; // bag (todo)
  }

  public unequipItem(item: Item): boolean {
    let did: boolean = false;

    if (item.isTool) {
      if (this.equippedItem === item) {
        this.equippedItem = Item.hand;
        did = true;
      }
    } else if (item.type === ItemType.ARMOR) {
      if (this.equippedHelmet === item) {
        this.equippedHelmet = Item.none;
        did = true;
      }
    }

    if (did)
      this.player.action = true;

    return did;
  }

  public equipItem(item: Item): void {
    if (!this.unequipItem(item))
      if (item.isTool) {
        this.equippedItem = item;
      } else {
        switch (item.type) {
          case ItemType.ARMOR: {
            this.equippedHelmet = item;
            break;
          }
          case ItemType.FOOD: {
            this.removeItem(item, RemoveType.AMOUNT, 1);
            // todo effects
            break;
          }
          default: {
            console.log('unsupported item type to interact with: ' + item.type);
            break;
          }
        }
      }
      // if (item.isTool()) {
      //   this.equippedItem = item;
      // } else if (item.type == ItemType.ARMOR) {
      //   this.equippedHelmet = item;
      // } else if (item.type == ItemType.FOOD) {
      //   this.removeItem(item, RemoveType.AMOUNT, 1);
      //   // todo: effects after eating food
      //   // for (var effect of item.onEat.split(";")) {
      //   //   var args = effect.split(":");
      //   //   switch (args[0]) {
      //   //     case "food":
      //   //       this.player.hunger += Number(args[1]);
      //   //       break;
      //   //     case "water":
      //   //       this.player.water += Number(args[1]);
      //   //       break;
      //   //     case "hp":
      //   //       this.player.health += Number(args[1]);
      //   //       break;
      //   //   }
      //   // }
      // }



    this.player.action = true;
  }

  public removeItems(items: ItemStack[]): void {
    for (const item of items) {
      this.removeItem(item.item, RemoveType.AMOUNT, item.amount);
    }
  }

  public removeItem(item: Item, removeType: RemoveType, amount: number = 1): void {
    // Utils.sendPacket(this.player.ws, new RemoveItemPacket(item, removeType, amount));

    for (const [i, itemStack] of this.items.entries()) {
      if (itemStack.item.id === item.id) {
        switch (removeType) {
          case RemoveType.SINGLE:
          case RemoveType.PLACE:
            itemStack.amount -= amount;
            break;
          case RemoveType.ALL:
            itemStack.amount = 0;
            break;
        }
        if (itemStack.amount <= 0) {
          this.items.splice(this.items.indexOf(itemStack), 1);
          this.unequipItem(itemStack.item);

        } else {
          this.items[i] = itemStack;
        }
      }
    }
  }

  public addItem(items: ItemStack[], sendPacket: boolean = true): void {
    // if (sendPacket)
    //   Utils.sendPacket(this.player.ws, new AddItemPacket(items));

    itemsLoop:
    for (const item of items) {
      for (const [i, itemStack] of this.items.entries()) {
        if (itemStack.item.id == item.item.id) {
          itemStack.amount += item.amount;
          this.items[i] = itemStack;

          continue itemsLoop;
        }
      }

      if (this.items.length < this.size) this.items.push(item);
    }
  }

  public containsItem(item: Item, amount: number = 1): boolean {
    if (item === Item.none || item === Item.hand)
      return true;

    for (const itemStack of this.items) {
      if (itemStack.item === item && itemStack.amount >= amount)
        return true;
    }

    return false;
  }

  constructor(player: Player) {
    this.player = player;
  }
}

export class Player extends Entity {
  // Player data
  public score: number = 0;
  public nickname: string = '';
  public skin: PlayerSkin = new PlayerSkin();
  
  // Player inventory
  public inventory: PlayerInventory = new PlayerInventory(this);

  // Player settings
  private attackElapsed: number = 0;
  private attackDuration: number = 0.20 * 0.11;

  // Player states
  public ghost: boolean = false;
  public attacking: boolean = false;

  // Entities own by this player
  public ownedEntities: Entity[] = [];

  // Player states update
  private resetAttacking(): void {
    this.attacking = false;
    this.attackElapsed = 0;
  }

  private processAttack(angle: number): void {
    this.state |= EntityState.ATTACK;

    for (const target of this.game.world.entities.array) {
      if (target instanceof Player) {
        if (target === this) continue;

      }
    }
  }

  constructor(game: Game, public client: NetworkClient, data: PlayerHandshakeInput) {
    super(game);

    // Setting client so we can send messages to it
    // related with game state n' things
    this.client = client;

    // Setting data properties
    let nickname: string = '';

    // If player nickname is empty make it default as 'Player#0'
    if (data.nickname) {
      if (isStringEmpty(data.nickname))
        nickname = `Player#${this.client.id}`;
      else
        nickname = data.nickname;
    } else nickname = `Player#${this.client.id}`;

    this.nickname = nickname;
  }

  public update(delta: number): void {
    super.update(delta);

    if (this.attacking) {
      this.attackElapsed += delta;

      if (this.attackElapsed >= this.attackDuration) {
        this.processAttack(this.angle);
        this.resetAttacking();
      }
    }
  }

  public attack(angle: number): void {
    this.attacking = true;
    this.action = true;
  }

  public stopAttack(): void {
    this.resetAttacking();

    this.state &= ~EntityState.ATTACK;
  }

  public sendUnits(): void {
    const units: Entity[] = this.game.world.entities.array;
    const packet: UpdateUnits = new UpdateUnits(units);

    this.client.socket.send(packet.build, true);
  }

  public sendLeaderboard(): void {
    const otherPlayers: Player[] = this.game.world.entities.array.filter(p => p && p instanceof Player) as Player[];
    const packet: Leaderboard = new Leaderboard(otherPlayers);

    this.client.socket.send(packet.build, true);
  }
}