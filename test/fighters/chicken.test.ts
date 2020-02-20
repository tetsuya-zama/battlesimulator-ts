import {Chicken} from '../../src/fighters/chicken';
import {IntValue, COMMAND } from '../../src/core';

/**
* Chickenクラスに関するテスト
* Fighterの継承クラスなのでコンストラクタと
* overrideしているchooseCommandメソッドのみテストする
*/
describe("Chiken",() => {
  /**
  * (Fighterと同じく)FighterStatusによって作成される
  */
  it("will be created with FighterStatus",()=>{
    const result = new Chicken({
      name:"ちきん",
      hp:IntValue.of(10),
      offence:IntValue.of(8),
      deffence:IntValue.of(3)
    });

    expect(result instanceof Chicken).toBe(true);
    expect(result.name).toBe("ちきん");
  });

  /**
  * chooseCommandメソッドについてのテスト
  */
  describe("chooseCommand",()=>{
    /**
    * 10%の確率で攻撃が選択される
    */
    it("chooses ATTACK or GUARD for 10%:90% each",()=>{
      const fighter = new Chicken({
        name:"ちきん",
        hp:IntValue.of(10),
        offence:IntValue.of(8),
        deffence:IntValue.of(3)
      });

      /**
      * 1000回試行して攻撃が出る確率が10%に近似するかテストする
      */

      const commands:COMMAND[] = [];
      for(var i=0; i<1000; i++){
        commands.push(fighter.getCurrentCommand());
        fighter.chooseCommand();
      }

      expect(commands.filter(c => c === COMMAND.ATTACK).length / commands.length).toBeCloseTo(0.1,1);
    });
  });
});
