import {IntValue, COMMAND, Fightable, CommandLog} from "../core";

export interface FighterStatus{
  readonly name: string
  readonly hp: IntValue
  readonly offence: IntValue
  readonly deffence: IntValue
}

export class Fighter implements Fightable{
  private _name: string
  private _hp: number
  private _offence: number
  private _deffence: number
  protected _currentCommand: COMMAND = COMMAND.ATTACK


  get name(){
    return this._name;
  }

  get alive(){
    return this._hp > 0;
  }

  constructor({name,hp,offence,deffence}: FighterStatus){
    if(name.length === 0) throw new Error("名前に空文字は指定できません");
    if(hp.value <= 0) throw new Error(`HPは1以上の数値を指定してください:${hp.value}`);
    if(offence.value <= 0) throw new Error(`攻撃力は1以上の数値を指定してください:${offence.value}`);
    if(deffence.value <= 0) throw new Error(`防御力は1以上の数値を指定してください:${deffence.value}`);

    this._name = name;
    this._hp = hp.value;
    this._offence = offence.value;
    this._deffence = deffence.value;
  }

  describeCurrentStatus():CommandLog{
    return [`${this._name} HP:${this._hp}`];
  }

  protected get offence(){
    return this._offence;
  }

  protected get deffence(){
    return this._currentCommand === COMMAND.GUARD ? this._deffence * 2 : this._deffence;
  }

  getCurrentCommand():COMMAND{
    return this._currentCommand;
  }

  hit(damage: IntValue): IntValue{
    const actualDamage = damage.value - this.deffence;
    this._hp -= actualDamage;
    return IntValue.of(actualDamage);
  }

  attack(enemy: Fightable):CommandLog{
    const actualDamage = enemy.hit(IntValue.of(this.offence));
    return [actualDamage.value >= 0 ? `${enemy.name}に${actualDamage.value}のダメージ` : `${enemy.name}は${actualDamage.value * -1}回復`]
  }

  chooseCommand():void{
    const chosen = Math.floor(Math.random() * 2);
    if(chosen === 0){
      this._currentCommand = COMMAND.ATTACK;
    }else{
      this._currentCommand = COMMAND.GUARD;
    }
  }
}
