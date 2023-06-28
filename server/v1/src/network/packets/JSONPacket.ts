import IPacket from "./IPacket";

export default interface JSONPacket extends IPacket {
  build(): object;
}