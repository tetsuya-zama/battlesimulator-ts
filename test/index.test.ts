import {load, BattleSimulatorSetting,isBattleSimulatorSetting} from '../src';
import {Battle, CommandLog} from '../src/core';

/**
* load関数についてのテスト
*/
describe("load",()=>{
  /**
  * BattleSimulatorSetting(設定ファイルの読み込み値)によってBattleのインスタンスを作成する
  */
  it("creates instance of Battle by BattleSimulatorSetting",()=>{
    const setting: BattleSimulatorSetting = {
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      }
    };

    const battle = load(setting);
    expect(battle instanceof Battle).toBe(true);

    const log: CommandLog = [];
    while(!battle.isFinished){
      log.push(...battle.nextTurn());
    }

    expect(log.some(l => l === `${setting.black.name} HP:${setting.black.hp}`)).toBe(true);
    expect(log.some(l => l === `${setting.white.name} HP:${setting.white.hp}`)).toBe(true);
  });

  /**
  * 最大ターン数を指定することもできる
  */
  it("might be specified maxTurn by setting",()=>{
    const setting: BattleSimulatorSetting = {
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      },
      maxTurn: 1 //最大ターン数を指定
    };

    const battle = load(setting);
    expect(battle instanceof Battle).toBe(true);

    const log: CommandLog = [];
    while(!battle.isFinished){
      log.push(...battle.nextTurn());
    }

    //1ターン目で強制終了なので"##2ターン目##"というログが存在"しない"はず
    expect(log.some(l => l === `##${setting.maxTurn ? setting.maxTurn + 1:0}ターン目##`)).toBe(false);
  });
});

/**
* isBattleSimulatorSetting関数についてのテスト
*/
describe("isBattleSimulatorSetting",()=>{
  /**
  * 引数に与えられたオブジェクトがBattleSimulatorSettingの定義に従っていればtrueを返す
  */
  it("returns true if argument is BattleSimulatorSetting",() => {
    expect(isBattleSimulatorSetting({
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      },
      maxTurn: 10
    })).toBe(true);
  });

  /**
  * maxTurnは指定しなくても構わない
  */
  it("also returns true even if maxTurn is undefined",() => {
    expect(isBattleSimulatorSetting({
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      }
    })).toBe(true);
  });

  /**
  * 定義に沿っていなければfalseを返す
  */
  it("returns false if argument is invalid",() => {
    //black(先手)の指定が無い
    expect(isBattleSimulatorSetting({
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      },
      maxTurn: 10
    })).toBe(false);
    //white(後手)の指定が無い
    expect(isBattleSimulatorSetting({
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      maxTurn: 10
    })).toBe(false);
    //必須パラメータ__typeが無い
    expect(isBattleSimulatorSetting({
      black: {
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      },
      maxTurn: 10
    })).toBe(false);
    //number型のパラメータにstringが入っている(必須項目)
    expect(isBattleSimulatorSetting({
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: "eight",　//数値でない
        offence: 4,
        deffence: 4
      },
      maxTurn: 10
    })).toBe(false);
    //number型のパラメータにstringが入っている(任意項目)
    expect(isBattleSimulatorSetting({
      black: {
        __type: "Fighter",
        name: "ぶらっく",
        hp: 10,
        offence: 5,
        deffence: 3
      },
      white: {
        __type: "Chicken",
        name: "ほわいと",
        hp: 8,
        offence: 4,
        deffence: 4
      },
      maxTurn: "ten"
    })).toBe(false);
  });
});
