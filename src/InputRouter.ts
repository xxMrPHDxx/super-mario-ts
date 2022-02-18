type Receiver = any;
type ReceiverCallback = (receiver: Receiver) => void;

export default class InputRouter {
  public receivers: Set<Receiver> = new Set();

  addReceiver(receiver: Receiver){
    this.receivers.add(receiver);
  }

  dropReceiver(receiver: Receiver){
    this.receivers.delete(receiver);
  }

  route(routeInput: ReceiverCallback){
    for(const receiver of this.receivers){
      routeInput(receiver);
    }
  }
}