import {load, BattleSimulatorSetting,isBattleSimulatorSetting} from '../src';
import {Battle, CommandLog} from '../src/core';

describe("load",()=>{
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
      maxTurn: 1
    };

    const battle = load(setting);
    expect(battle instanceof Battle).toBe(true);

    const log: CommandLog = [];
    while(!battle.isFinished){
      log.push(...battle.nextTurn());
    }

    expect(log.some(l => l === `##${setting.maxTurn ? setting.maxTurn + 1:0}ターン目##`)).toBe(false);
  });
});

describe("isBattleSimulatorSetting",()=>{
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

  it("returns false if argument is invalid",() => {
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
        hp: "eight",
        offence: 4,
        deffence: 4
      },
      maxTurn: 10
    })).toBe(false);
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
