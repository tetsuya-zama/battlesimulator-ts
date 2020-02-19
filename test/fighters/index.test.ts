import {createFighter} from '../../src/fighters';
import {Fighter} from '../../src/fighters/fighter';
import {Chicken} from '../../src/fighters/chicken';

describe("createFighter",() => {
  it("creates Fighter instance if requested",() =>{
    const result = createFighter({
      __type:"Fighter",
      name:"ふぁいたー",
      hp:10,
      offence:5,
      deffence:3
    });

    expect(result instanceof Fighter).toBe(true);
  });

  it("creates Chicken instance if requested",()=>{
    const result = createFighter({
      __type:"Chicken",
      name:"ちきん",
      hp:10,
      offence:5,
      deffence:3
    });

    expect(result instanceof Chicken).toBe(true);
  });

  it("throws Error if the request is invalid",()=>{
    expect(() => {
      createFighter({
        __type:"ちきん",
        name:"ちきん",
        hp:10,
        offence:5,
        deffence:3
      });
    }).toThrow();

    expect(() => {
      createFighter({
        name:"ちきん",
        hp:10,
        offence:5,
        deffence:3
      });
    }).toThrow();

    expect(() => {
      createFighter({
        __type:"Chicken",
        hp:10,
        offence:5,
        deffence:3
      });
    }).toThrow();

    expect(() => {
      createFighter({
        __type:"Chicken",
        name:"ちきん",
        offence:5,
        deffence:3
      });
    }).toThrow();

    expect(() => {
      createFighter({
        __type:"Chicken",
        name:"ちきん",
        hp:10,
        deffence:3
      });
    }).toThrow();

    expect(() => {
      createFighter({
        __type:"Chicken",
        name:"ちきん",
        hp:10,
        offence:5
      });
    }).toThrow();

    expect(() => {
      createFighter({
        __type:true,
        name:0,
        hp:false,
        offence:"hoge",
        deffence:{value:10}
      });
    }).toThrow();
  });
});
