import {Chicken} from '../../src/fighters/chicken';
import {IntValue, COMMAND } from '../../src/core';

describe("Chiken",() => {
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

  describe("chooseCommand",()=>{
    it("chooses ATTACK or GUARD for 10%:90% each",()=>{
      const fighter = new Chicken({
        name:"ちきん",
        hp:IntValue.of(10),
        offence:IntValue.of(8),
        deffence:IntValue.of(3)
      });

      const commands:COMMAND[] = [];
      for(var i=0; i<1000; i++){
        commands.push(fighter.getCurrentCommand());
        fighter.chooseCommand();
      }

      expect(commands.filter(c => c === COMMAND.ATTACK).length / commands.length).toBeCloseTo(0.1,1);
    });
  });
});
