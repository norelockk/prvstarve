import { ItemType } from "../../enums";

export class Damage {
  public pvp: number = 0;
  public pve: number = 0;
}

export class Item {
  public id: number = 0;
  public type: ItemType = ItemType.NONE;
  public damage: Damage = new Damage();
  public range: number = 0;
  public defense: Damage = new Damage();
  public tier: number = 0;
  public onEat: string = "";
  public structureId: number = 0;

  get isTool(): boolean {
    return this.type === ItemType.PICKAXE || this.type === ItemType.HAMMER || this.type === ItemType.SHOVEL || this.type === ItemType.WEAPON || this.type === ItemType.TOOL || this.type === ItemType.PITCHFORK;
  }

  get isCombatItem(): boolean {
    return this.type === ItemType.WEAPON;
  }

  public static list: Item[] = [];
  public static hand: Item;
  public static none: Item = new Item();
}

export class ItemStack {
  public item: Item;
  public amount: number;

  constructor(item: Item, amount: number = 1) {
    this.item = item;
    this.amount = amount;
  }
}