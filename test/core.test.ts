import {IntValue, COMMAND, Fightable, Battle, CommandLog} from '../src/core';

/**
* [[IntValue]]オブジェクトについてのテスト
*/
describe("IntValue",()=>{
  /**
  * 整数によって作られる
  */
  it("will be created by integer number",()=>{
    expect(IntValue.of(-1).value).toBe(-1);
    expect(IntValue.of(0).value).toBe(0);
    expect(IntValue.of(1).value).toBe(1);
    expect(IntValue.of(Number.MAX_SAFE_INTEGER).value).toBe(Number.MAX_SAFE_INTEGER);
    expect(IntValue.of(Number.MIN_SAFE_INTEGER).value).toBe(Number.MIN_SAFE_INTEGER);
  });
  /**
  * IntValueそのものによっても作られる
  */
  it("will also be created by itself",()=>{
    expect(IntValue.of(IntValue.of(-1)).value).toBe(-1);
    expect(IntValue.of(IntValue.of(0)).value).toBe(0);
    expect(IntValue.of(IntValue.of(1)).value).toBe(1);
  });
  /**
  * 整数以外から作ろうとするとエラーが発生する
  */
  it("will throw Error if the value is not integer",()=>{
    expect(()=> IntValue.of(0.1)).toThrow();
    expect(()=> IntValue.of(-0.1)).toThrow();
  });
});

/**
* [[Battle]]オブジェクトについてのテスト
*
* ※あくまでBattleの単体テストなのでFightableにはMockを使用している
*/
describe("Battle",()=>{
  /**
  * [[Fightable]]を２つ指定して作ることができる
  */
  it("will be created with two Fightables",()=>{
    const result = new Battle({
      black:{
        name:"ぶらっく",
        alive:true,
        describeCurrentStatus: ():string[] => [],
        getCurrentCommand: () => COMMAND.ATTACK,
        hit: (damage: IntValue) => damage,
        attack:():string[] => [],
        chooseCommand:() => {}
      },
      white:{
        name:"ほわいと",
        alive:true,
        describeCurrentStatus: ():string[] => [],
        getCurrentCommand: () => COMMAND.ATTACK,
        hit: (damage: IntValue) => damage,
        attack:():string[] => [],
        chooseCommand:() => {}
      }
    });

    expect(result instanceof Battle).toBe(true);
    expect(result.isFinished).toBe(false);//default value
  });

  /**
  * [[Fightable]]2つと最大ターン数を指定して作ることもできる
  */
  it("will be created with two Fightables and max turns",()=>{
    const result = new Battle({
      black:{
        name:"ぶらっく",
        alive:true,
        describeCurrentStatus: ():string[] => [],
        getCurrentCommand: () => COMMAND.ATTACK,
        hit: (damage: IntValue) => damage,
        attack:():string[] => [],
        chooseCommand:() => {}
      },
      white:{
        name:"ほわいと",
        alive:true,
        describeCurrentStatus: ():string[] => [],
        getCurrentCommand: () => COMMAND.ATTACK,
        hit: (damage: IntValue) => damage,
        attack:():string[] => [],
        chooseCommand:() => {}
      },
      maxTurn: IntValue.of(10)
    });

    expect(result instanceof Battle).toBe(true);
    expect(result.isFinished).toBe(false);//default value
  });

  /**
  * nextTurnメソッドについてのテスト
  */
  describe("nextTurn",()=>{
    /**
    * どちらかのFightableが死亡したら戦闘を終了する
    */
    it("will finishes the battle if one of Fightables is dead",()=>{
      const black: Fightable = {
        name:"ぶらっく",
        alive:true,
        describeCurrentStatus: jest.fn().mockReturnValue([]),
        getCurrentCommand: jest.fn().mockReturnValue(COMMAND.ATTACK),
        hit: jest.fn().mockReturnValue(IntValue.of(0)),
        attack:jest.fn().mockReturnValue([]),
        chooseCommand:jest.fn()
      };

      const white: Fightable = {
        name:"ほわいと",
        alive:false,
        describeCurrentStatus: jest.fn().mockReturnValue([]),
        getCurrentCommand: jest.fn().mockReturnValue(COMMAND.GUARD),
        hit: jest.fn().mockReturnValue(IntValue.of(0)),
        attack:jest.fn().mockReturnValue([]),
        chooseCommand:jest.fn()
      }
      const battle = new Battle({black,white});

      const log = battle.nextTurn();

      expect(black.describeCurrentStatus).toBeCalled();
      expect(white.describeCurrentStatus).toBeCalled();
      expect(black.getCurrentCommand).toBeCalled();
      expect(white.getCurrentCommand).not.toBeCalled();
      expect(black.hit).not.toBeCalled();
      expect(white.hit).not.toBeCalled();
      expect(black.attack).toBeCalledWith(white);
      expect(white.attack).not.toBeCalled();
      expect(black.chooseCommand).toBeCalled();
      expect(white.chooseCommand).toBeCalled();

      expect(log.some(l => l === `${black.name}の攻撃`)).toBe(true);
      expect(log.some(l => l === `${white.name}は死亡した`)).toBe(true);
      expect(battle.isFinished).toBe(true);
      expect(() => battle.nextTurn()).toThrow(); // throws error if nextTurn is called after battle has finished.
    });

    /**
    * 両方の[[Fightable]]が生存していれば戦闘を続行する
    */
    it("will not finish battle if both of Fightables are alive",()=>{
      const black: Fightable = {
        name:"ぶらっく",
        alive:true,
        describeCurrentStatus: jest.fn().mockReturnValue([]),
        getCurrentCommand: jest.fn().mockReturnValue(COMMAND.ATTACK),
        hit: jest.fn().mockReturnValue(IntValue.of(0)),
        attack:jest.fn().mockReturnValue([]),
        chooseCommand:jest.fn()
      };

      const white: Fightable = {
        name:"ほわいと",
        alive:true,
        describeCurrentStatus: jest.fn().mockReturnValue([]),
        getCurrentCommand: jest.fn().mockReturnValue(COMMAND.GUARD),
        hit: jest.fn().mockReturnValue(IntValue.of(0)),
        attack:jest.fn().mockReturnValue([]),
        chooseCommand:jest.fn()
      }
      const battle = new Battle({black,white});

      const log = battle.nextTurn();

      expect(black.describeCurrentStatus).toBeCalled();
      expect(white.describeCurrentStatus).toBeCalled();
      expect(black.getCurrentCommand).toBeCalled();
      expect(white.getCurrentCommand).toBeCalled();
      expect(black.hit).not.toBeCalled();
      expect(white.hit).not.toBeCalled();
      expect(black.attack).toBeCalledWith(white);
      expect(white.attack).not.toBeCalled();
      expect(black.chooseCommand).toBeCalled();
      expect(white.chooseCommand).toBeCalled();

      expect(log.some(l => l === `${black.name}の攻撃`)).toBe(true);
      expect(log.some(l => l === `${white.name}は身を守っている`)).toBe(true);
      expect(battle.isFinished).toBe(false);
      expect(() => battle.nextTurn()).not.toThrow();
    });

    /**
    * 総ターン数が最大ターン数を上回れば戦闘を終了する
    */
    it("will finish battle when number of turns reaches max turn",()=>{
      const maxTurn = IntValue.of(10);
      const black: Fightable = {
        name:"ぶらっく",
        alive:true,
        describeCurrentStatus: jest.fn().mockReturnValue([]),
        getCurrentCommand: jest.fn().mockReturnValue(COMMAND.ATTACK),
        hit: jest.fn().mockReturnValue(IntValue.of(0)),
        attack:jest.fn().mockReturnValue([]),
        chooseCommand:jest.fn()
      };

      const white: Fightable = {
        name:"ほわいと",
        alive:true,
        describeCurrentStatus: jest.fn().mockReturnValue([]),
        getCurrentCommand: jest.fn().mockReturnValue(COMMAND.GUARD),
        hit: jest.fn().mockReturnValue(IntValue.of(0)),
        attack:jest.fn().mockReturnValue([]),
        chooseCommand:jest.fn()
      }

      const battle = new Battle({black,white,maxTurn});

      const log:CommandLog = [];
      expect(()=>{
        while(!battle.isFinished){
          log.push(...battle.nextTurn());
        }
      }).not.toThrow();

      expect(log.some(l => l === `##${maxTurn.value}ターン目##`)).toBe(true);
      expect(log.some(l => l === "##勝負がつかないため引き分けになりました##")).toBe(true);
      expect(battle.isFinished).toBe(true);
    });
  });
});
