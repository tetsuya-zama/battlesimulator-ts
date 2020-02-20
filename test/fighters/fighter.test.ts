import {Fighter, FighterStatus} from '../../src/fighters/fighter';
import {IntValue, COMMAND, CommandLog} from '../../src/core';

/**
* Fighterオブジェクトについてのテスト
*/
describe("Fighter",()=>{
  /**
  * FighterStatusを与えられることによって作られる
  */
  it("will be created with FighterStatus",()=>{
    const result = new Fighter({
      name:"ブラック",
      hp:IntValue.of(8),
      offence:IntValue.of(5),
      deffence:IntValue.of(3)
    });

    expect(result instanceof Fighter).toBe(true);
    expect(result.name).toBe("ブラック");
    expect(result.alive).toBe(true);
  });

  /**
  * パラメータに不備がある場合はエラーが発生する
  */
  it("will throw Error if some parameters of status are invalid",()=>{
    expect(()=> new Fighter({
      name:"",
      hp:IntValue.of(8),
      offence:IntValue.of(5),
      deffence:IntValue.of(3)
    })).toThrow("名前に空文字は指定できません");

    expect(()=> new Fighter({
      name:"ブラック",
      hp:IntValue.of(0),
      offence:IntValue.of(5),
      deffence:IntValue.of(3)
    })).toThrow("HPは1以上の数値を指定してください");

    expect(()=> new Fighter({
      name:"ブラック",
      hp:IntValue.of(8),
      offence:IntValue.of(0),
      deffence:IntValue.of(3)
    })).toThrow("攻撃力は1以上の数値を指定してください");

    expect(()=> new Fighter({
      name:"ブラック",
      hp:IntValue.of(8),
      offence:IntValue.of(5),
      deffence:IntValue.of(0)
    })).toThrow("防御力は1以上の数値を指定してください");
  });

  /**
  * describeCurrentStatusメソッドについてのテスト
  */
  describe("describeCurrentStatus",()=>{
    /**
    * 現在の状態をCommandLogとして返す
    */
    it("returns current status of the fighter as CommandLog",()=>{
      const status: FighterStatus = {
        name:"ブラック",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      const fighter = new Fighter(status);

      const log: CommandLog = fighter.describeCurrentStatus();
      expect(log.length).toBe(1);
      expect(log[0]).toBe(`${status.name} HP:${status.hp.value}`);
    });
  });

  /**
  * chooseCommandメソッドについてのテスト
  */
  describe("chooseCommand",()=>{
    /**
    * 50%50%の確率で攻撃か防御が選択される
    */
    it("chooses ATTACK or GUARD for 50% each",()=>{
      const status: FighterStatus = {
        name:"ブラック",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      const fighter = new Fighter(status);

      /**
      * chooseCommandメソッドを1000回実行して
      * COMMAND.ATTACK(攻撃)が出る確率が50%に近似するか確認する
      */

      const commands:COMMAND[] = [];
      for(var i=0; i<1000; i++){
        commands.push(fighter.getCurrentCommand());
        fighter.chooseCommand();
      }

      expect(commands.filter(c => c === COMMAND.ATTACK).length / commands.length).toBeCloseTo(0.5,1);
    });
  });

  /**
  * hitメソッドについてのテスト
  */
  describe("hit",() =>{
    /**
    * 引数とFighterの防御力の差を返す
    */
    it("returns sub of argument and its deffence",() => {
      const status: FighterStatus = {
        name:"ブラック",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      const fighter = new Fighter(status);

      const damage = fighter.hit(IntValue.of(5));
      expect(damage.value).toBe(5 - status.deffence.value);
    });
    /**
    * 内部でHPが減少する
    */
    it("reduces inner hp of fighter",()=>{
      const status: FighterStatus = {
        name:"ブラック",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      const fighter = new Fighter(status);

      fighter.hit(IntValue.of(10)); // 10 - 3 = 7 damage
      expect(fighter.alive).toBe(true); // 1 HP remains
      fighter.hit(IntValue.of(4)); // 4 - 3 = 1 damage
      expect(fighter.alive).toBe(false); // 0 HP (dead)
    });

    /**
    * コマンドが「防御」の場合、防御力が２倍になる
    */
    it("returns sub of argument and double of its deffence if the command of the fighter is GUARD",()=>{
      const status: FighterStatus = {
        name:"ブラック",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      //コマンドが防御になるまでchooseCommandを実行し続ける。。
      const fighter = new Fighter(status);
      while(fighter.getCurrentCommand() === COMMAND.ATTACK){
        fighter.chooseCommand();
      }

      expect(fighter.getCurrentCommand()).toBe(COMMAND.GUARD);
      const damage = fighter.hit(IntValue.of(5));
      expect(damage.value).toBe(5 - status.deffence.value * 2);
    });
  });

  /**
  * attackメソッドについてのテスト
  */
  describe("attack",()=>{
    /**
    *　攻撃の結果をCommandLogとして返す
    */
    it("retuns result of attacking as CommandLog",()=>{
      const blackStatus: FighterStatus = {
        name:"ブラック",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      const black = new Fighter(blackStatus);

      const whiteStatus: FighterStatus = {
        name:"ホワイト",
        hp:IntValue.of(8),
        offence:IntValue.of(5),
        deffence:IntValue.of(3)
      };

      const white = new Fighter(whiteStatus);

      const log1 = black.attack(white); // 5 - 3 = 2 damage
      expect(log1.length).toBe(1);
      expect(log1[0]).toBe(`${white.name}に2のダメージ`);

      while(white.getCurrentCommand() == COMMAND.ATTACK){
        white.chooseCommand();
      }

      //ダメージを計算した結果負の値になれば回復する
      expect(white.getCurrentCommand()).toBe(COMMAND.GUARD);
      const log2 = black.attack(white); // 5 - (3 * 2) = -1
      expect(log2.length).toBe(1);
      expect(log2[0]).toBe(`${white.name}は1回復`);
    });
  });
});
