/**
* [[Fightable]]の取る行動
*/
export enum COMMAND{
  /**攻撃*/
  ATTACK,
  /**防御*/
  GUARD
}

/**
* ValueObjectの共通インタフェース
* @typeparam T 実体の型
*/
export interface Value<T>{
  /** ValueObjectの実体 */
  readonly value:T
}

/**
* Int(整数)のValueObject
* javascript(typescript)は数を表すnumber型はあるが整数型が無いので、util的な観点でValueObjectを作成した
*/
export class IntValue implements Value<number>{
  /**
  * 実体の数値
  */
  private _value: number;
  /**
  * 実体を返す
  */
  get value(){
    return this._value;
  }
  /**
  * コンストラクタ
  * 与えられたvalueが整数でなければエラーをthrowする
  * @param value 実体（整数であるべき）
  */
  protected constructor(value: number){
    if(Math.floor(value) === value){
      this._value = value;
    }else{
      throw new Error(`The value is not integer:${value}`);
    }
  }

  /**
  * IntValueを作成する
  * @usage
  * ```ts
  * const intNum = IntValue.of(8);
  * console.log(intNum.value);//-> "8"
  * const invalidIntNum = IntValue.of(8.1); //throws Error
  * ```
  * @param n 整数もしくはnumberのValueObject
  */
  static of(n: number | Value<number>):IntValue{
    return typeof n === "number" ? new IntValue(n) : new IntValue(n.value);
  }
}

/**
* [[Battle]]の実行結果
* 実体はstringの配列
* @usage
* ```ts
* while(!battle.isFinished{
*     const log:CommandLog = battle.nextTurn();
*     // 1行分ずつログが格納されている
*     log.forEach(line => console.log(line));
* }
* ```
*/
export type CommandLog = string[]

/**
* バトルを行うことができるオブジェクトのinterface
*/
export interface Fightable{
  /**名前*/
  readonly name: string
  /**生存中かどうか*/
  readonly alive: boolean
  /**現在の状態を[[CommandLog]]として返す*/
  describeCurrentStatus():CommandLog
  /**自身が今選択している[[COMMAND]]を返す*/
  getCurrentCommand(): COMMAND
  /**
  * 攻撃を受ける
  * @param damage 与えたいダメージ
  * @return 自身の防御力を加味した最終ダメージ(負の数なら回復)
  */
  hit(damage: IntValue): IntValue
  /**
  * 引数に与えられた[[Fightable]]を攻撃する
  * @param 攻撃される[[Fightable]]
  * @return 攻撃結果[[CommandLog]]
  */
  attack(enemy: Fightable): CommandLog
  /**
  * [[COMMAND]]を選択する
  */
  chooseCommand():void
}

/**
* Battle(戦闘)オブジェクト
* BattleSiulator全体のメインオブジェクト
*/
export class Battle{
  /**
  * 先手
  */
  private _black: Fightable;
  /**
  * 後手
  */
  private _white: Fightable;
  /**
  * 現在のターン
  */
  private _turn: number = 0;
  /**
  * 最大ターン
  */
  private _maxTurn: number
  /**
  * 戦闘が終了しているかどうか
  */
  private _isFinished: boolean = false;

  /**
  * 戦闘が終了しているかどうかを返す
  * @useage
  * ```ts
  * //戦闘が終了するまでlogを出力しながら次のターンを実行する
  * while(!battle.isFinished){
  *    battle.nextTurn().forEach(l => console.log(l));
  * }
  * ```
  * @return 終了していればtrue
  */
  get isFinished(){
    return this._isFinished;
  }

  /**
  * コンストラクタ
  * @param black 先手の[[Fightable]]
  * @param white 後手の[[Fightable]]
  * @param maxTurn 最大ターン
  */
  constructor({black, white, maxTurn = IntValue.of(100)}
    :{black:Fightable, white:Fightable,maxTurn?:IntValue}){
    this._black = black;
    this._white = white;
    this._maxTurn = maxTurn.value;
  }

  /**
  * 次のターンを実行する
  * ```ts
  * //戦闘が終了するまでlogを出力しながら次のターンを実行する
  * while(!battle.isFinished){
  *    battle.nextTurn().forEach(l => console.log(l));
  * }
  * ```
  * @return 実行結果の[[CommandLog]]
  */
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

  /**
  * 引き分けかどうか
  * @return 引き分けならtrue
  */
  private isDraw():boolean{
    return this._turn > this._maxTurn;
  }

  /**
  * 戦闘を終了させる
  */
  private finish(){
    this._isFinished = true;
  }

  /**
  * 第１引数に設定した[[Fightable]]のコマンドを実行する
  * @param me コマンドを実行する[[Fightable]]
  * @param enemy コマンドが「攻撃」のとき攻撃される[[Fightable]]
  * @return 実行結果の[[CommandLog]]
  */
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
