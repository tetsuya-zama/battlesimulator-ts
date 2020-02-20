import {createFighter} from '../../src/fighters';
import {Fighter} from '../../src/fighters/fighter';
import {Chicken} from '../../src/fighters/chicken';

/**
* createFighter関数に関するテスト
*/
describe("createFighter",() => {
  /**
  * __typeに"Fighter"が指定された場合,Fighterインスタンスを作成する
  */
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
  /**
  * __typeに"Chicken"が指定された場合Chickenインスタンスを作成する
  */
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

  /**
  * パラメータに不備がある場合にはエラーが発生する
  */
  it("throws Error if the request is invalid",()=>{
    //__typeが"Fighter","Chicken"以外
    expect(() => {
      createFighter({
        __type:"ちきん",
        name:"ちきん",
        hp:10,
        offence:5,
        deffence:3
      });
    }).toThrow();
    //__typeの指定が無い
    expect(() => {
      createFighter({
        name:"ちきん",
        hp:10,
        offence:5,
        deffence:3
      });
    }).toThrow();
    //nameがない
    expect(() => {
      createFighter({
        __type:"Chicken",
        hp:10,
        offence:5,
        deffence:3
      });
    }).toThrow();
    //hpが無い
    expect(() => {
      createFighter({
        __type:"Chicken",
        name:"ちきん",
        offence:5,
        deffence:3
      });
    }).toThrow();
    //offenceが無い
    expect(() => {
      createFighter({
        __type:"Chicken",
        name:"ちきん",
        hp:10,
        deffence:3
      });
    }).toThrow();
    //deffenceが無い
    expect(() => {
      createFighter({
        __type:"Chicken",
        name:"ちきん",
        hp:10,
        offence:5
      });
    }).toThrow();
    //パラメータの型が異なる
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
