export enum COMMAND{
  ATTACK,
  GUARD
}

export interface Value<T>{
  readonly value:T
}

export class IntValue implements Value<number>{
  private _value: number;
  get value(){
    return this._value;
  }

  protected constructor(value: number){
    if(Math.floor(value) === value){
      this._value = value;
    }else{
      throw new Error(`The value is not integer:${value}`);
    }
  }

  static of(n: number | Value<number>):IntValue{
    return typeof n === "number" ? new IntValue(n) : new IntValue(n.value);
  }
}

export type CommandLog = string[]

export interface Fightable{
  readonly name: string
  readonly alive: boolean
  describeCurrentStatus():CommandLog
  getCurrentCommand(): COMMAND
  hit(damage: IntValue): IntValue
  attack(enemy: Fightable): CommandLog
  chooseCommand():void
}

export class Battle{
  private _black: Fightable;
  private _white: Fightable;
  private _turn: number = 0;
  private _maxTurn: number
  private _isFinished: boolean = false;

  get isFinished(){
    return this._isFinished;
  }

  constructor({black, white, maxTurn = IntValue.of(100)}
    :{black:Fightable, white:Fightable,maxTurn?:IntValue}){
    this._black = black;
    this._white = white;
    this._maxTurn = maxTurn.value;
  }

  public nextTurn(): CommandLog{
    const log:CommandLog = [];

    if(this._isFinished) throw new Error("戦闘は既に終了しています");

    this._turn++;

    if(this.isDraw()){
      log.push("##勝負がつかないため引き分けになりました##");
      this.finish();
      return log;
    }

    log.push(`##${this._turn}ターン目##`);
    log.push(...this._black.describeCurrentStatus());
    log.push(...this._white.describeCurrentStatus());

    this._black.chooseCommand();
    this._white.chooseCommand();

    log.push(...this.doCommand(this._black, this._white));

    if(!this.isFinished){
      log.push(...this.doCommand(this._white, this._black));
    }

    return log;
  }

  private isDraw():boolean{
    return this._turn > this._maxTurn;
  }
  private finish(){
    this._isFinished = true;
  }

  private doCommand(me: Fightable, enemy: Fightable): CommandLog{
    if(me.getCurrentCommand() == COMMAND.ATTACK){
      const log: CommandLog = [];

      log.push(`${me.name}の攻撃`);
      log.push(...me.attack(enemy));

      if(!enemy.alive){
        log.push(`${enemy.name}は死亡した`);
        this.finish();
      }

      return log;
    }else{
      return [`${me.name}は身を守っている`];
    }
  }


}
