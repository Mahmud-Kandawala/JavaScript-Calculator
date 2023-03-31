  let mathController = (() => {
    let numberArr = [],
      acc = 0,
      result = 0,
      opCount = 0;
    let menus = 0,
      auxCalcMenus = 0,
      sign; 
    let modu = 0,
      per = 0,
      tempAcc = 0; 
  
    return {
      addToMathCtrl: (numberInput) => {
        if (numberInput === '+/-') {
          if (opCount === 0 && acc !== 0) {
            acc < 0 ? (acc = acc * -1) : (acc = acc * -1);
            numberArr = [];
            numberArr.push(acc);
          } else {
            if (/\d+$/g.test(acc)) {
              menus = acc.split(/\D/g);
              menus = menus.pop();
              menus *= -1;
              acc = acc.replace(/\d+$/g, '');
              auxCalcMenus = acc.split(/\d/g);
              auxCalcMenus = auxCalcMenus.join('');
              auxCalcMenus = auxCalcMenus.split('');
              auxCalcMenus = auxCalcMenus.pop();
              if (auxCalcMenus === '-') {
                acc = acc.replace(/\D$/g, '');
                acc = acc.split('');
                acc.push('+');
                acc = acc.join('');
                menus *= -1;
              }
              numberArr = [];
              numberArr.push(acc);
              numberArr.push(menus);
              acc = numberArr.join('');
            }
          }
        } else if (numberInput === '%') {
          if (opCount === 0 && acc !== 0) {
            acc = acc / 100;
            numberArr = [];
            numberArr.push(acc);
          } else {
            if (/\d+$/g.test(acc)) {
              modu = acc.split(/\D/g);
              modu = modu.pop();
              acc = acc.replace(/\d+$/g, '');
              tempAcc = acc;
              acc = acc.replace(/\D+$/g, '');
              acc = eval(acc);
              per = (acc * modu) / 100;
              numberArr = [];
              numberArr.push(tempAcc);
              numberArr.push(per);
              acc = numberArr.join('');
              acc = acc.replace(/\s/g, '');
            }
          }
        } else if (numberInput === 'c') {
          result = 0;
          numberArr = [];
          acc = 0;
          tempAcc = 0;
          opCount = 0;
          menus = 0;
          per = 0;
          modu = 0;
        } else if (numberInput === '=') {
          result = eval(acc);
          Number.isInteger(result)
            ? (result = result)
            : (result = result.toFixed(2));
          acc = result;
          numberArr = [];
          numberArr.push(result);
          opCount = 0;
        } else {
          typeof numberInput === 'string' ? opCount++ : (opCount = opCount);
          numberArr.push(numberInput);
          acc = numberArr.join('');
        }
  
        return {
          result: result,
          acc: acc,
          per: per,
        };
      },
    };
  })();
  
  let uiController = (() => {
    let DOMstrings = {
      lcd: '#display',
      lcdMini: '#displayMini',
    };
  
    let displayArr = [],
      mainDisLimit = false; 
    let miniDisplayArr = [],
      tempPer = 0,
      miniDisLimit = false; 
  
    return {
      printIntoDisplay: (displayInput, result) => {
        if (typeof displayInput !== 'string' || displayInput === '.') {
          if (displayArr.length < 12) {
            displayArr.push(displayInput);
            displayInput = displayArr.join('');
            document.querySelector(DOMstrings.lcd).innerHTML = displayInput;
          } else {
            mainDisLimit = true;
            displayArr = [];
            document.querySelector(DOMstrings.lcd).innerHTML = 0;
          }
        } else if (displayInput === '+/-') {
          displayArr = [];
          document.querySelector(DOMstrings.lcd).innerHTML = '-';
        } else if (displayInput === '%') {
          displayArr = [];
          document.querySelector(DOMstrings.lcd).innerHTML = result;
        } else if (displayInput === 'c') {
          mainDisLimit = false;
          displayArr = [];
          document.querySelector(DOMstrings.lcd).innerHTML = 0;
        } else {
          if (displayInput === '=') {
            document.querySelector(DOMstrings.lcd).innerHTML = result;
            displayArr = [];
            displayArr.push(result);
          } else {
            displayArr = [];
            document.querySelector(DOMstrings.lcd).innerHTML = displayInput;
          }
        }
  
        return mainDisLimit;
      },
  
      printIntoMiniDisplay: (numMini, result) => {
        switch (numMini) {
          case '+/-':
            miniDisplayArr = [];
            miniDisplayArr.push(result);
            numMini = miniDisplayArr.join('');
            document.querySelector(DOMstrings.lcdMini).innerHTML = numMini;
            break;
  
          case '%':
            numMini = miniDisplayArr.join('');
            if (/\D/g.test(numMini)) {
              if (/\./g.test(numMini)) {
                numMini = result;
                miniDisplayArr = [];
                miniDisplayArr.push(numMini);
              } else {
                numMini = numMini.replace(/\d+$/g, '');
                miniDisplayArr = [];
                miniDisplayArr.push(numMini);
                miniDisplayArr.push(result);
              }
            } else {
              miniDisplayArr = [];
              miniDisplayArr.push(result);
            }
            numMini = miniDisplayArr.join('');
            document.querySelector(DOMstrings.lcdMini).innerHTML = numMini;
            break;
  
          case 'c':
            miniDisplayArr = [];
            tempPer = 0;
            miniDisLimit = false;
            document.querySelector(DOMstrings.lcdMini).innerHTML = '';
            break;
  
          default:
            if (miniDisplayArr.length < 20) {
              miniDisplayArr.push(numMini);
              if (result !== undefined) {
                miniDisplayArr.push(result);
                numMini = miniDisplayArr.join('');
                document.querySelector(DOMstrings.lcdMini).innerHTML = numMini;
                miniDisplayArr = [];
                miniDisplayArr.push(result);
                countMenus = 0;
              } else {
                numMini = miniDisplayArr.join('');
                document.querySelector(DOMstrings.lcdMini).innerHTML = numMini;
              }
            } else {
              miniDisLimit = true;
            }
            break;
        }
        return miniDisLimit;
      },
    };
  })();
  
  let controller = ((mathCtrl, uiCtrl) => {
    let finalRes = 0,
      startOp = false,
      countOp = false,
      auxPer = 0,
      equalFlag = false,
      limit = false,
      period = false;
    let setupEventListeners = () => {
      document.addEventListener('click', (event) => {
        switch (event.target.id) {
          case 'c':
            if (startOp) {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'plusOrMenus':
            if (startOp === true && countOp === true) {
              finalRes = ctrlAddInput('+/-');
              ctrlAddToDisplay('+/-', finalRes.acc);
              ctrlAddToDisplayMini('+/-', finalRes.acc);
            }
            break;
  
          case 'period':
            if (startOp && !period) {
              period = true;
              ctrlAddInput('.');
              ctrlAddToDisplay('.');
              ctrlAddToDisplayMini('.');
            }
            break;
  
          case 'zero':
            if (!limit) {
              ctrlAddInput(0);
              limit = ctrlAddToDisplay(0);
              limit = ctrlAddToDisplayMini(0);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'one':
            if (!limit) {
              ctrlAddInput(1);
              limit = ctrlAddToDisplay(1);
              limit = ctrlAddToDisplayMini(1);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'two':
            if (!limit) {
              ctrlAddInput(2);
              limit = ctrlAddToDisplay(2);
              limit = ctrlAddToDisplayMini(2);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'three':
            if (!limit) {
              ctrlAddInput(3);
              limit = ctrlAddToDisplay(3);
              limit = ctrlAddToDisplayMini(3);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'four':
            if (!limit) {
              ctrlAddInput(4);
              limit = ctrlAddToDisplay(4);
              limit = ctrlAddToDisplayMini(4);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'five':
            if (!limit) {
              ctrlAddInput(5);
              limit = ctrlAddToDisplay(5);
              limit = ctrlAddToDisplayMini(5);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'six':
            if (!limit) {
              ctrlAddInput(6);
              limit = ctrlAddToDisplay(6);
              limit = ctrlAddToDisplayMini(6);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'seven':
            if (!limit) {
              ctrlAddInput(7);
              limit = ctrlAddToDisplay(7);
              limit = ctrlAddToDisplayMini(7);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'eigth':
            if (!limit) {
              ctrlAddInput(8);
              limit = ctrlAddToDisplay(8);
              limit = ctrlAddToDisplayMini(8);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'nine':
            if (!limit) {
              ctrlAddInput(9);
              limit = ctrlAddToDisplay(9);
              limit = ctrlAddToDisplayMini(9);
              startOp = true;
              countOp = true;
            } else {
              ctrlAddInput('c');
              ctrlAddToDisplay('c');
              ctrlAddToDisplayMini('c');
              startOp = false;
              countOp = false;
              auxPer = 0;
              finalRes = 0;
              equalFlag = false;
              limit = false;
              period = false;
            }
            break;
  
          case 'percentage':
            if (startOp === true && countOp === true && auxPer < 2) {
              finalRes = ctrlAddInput('%');
              finalRes.per !== 0
                ? ctrlAddToDisplay('%', finalRes.per)
                : ctrlAddToDisplay('%', finalRes.acc);
              if (equalFlag === true || finalRes.per === 0) {
                ctrlAddToDisplayMini('%', finalRes.acc);
              } else {
                ctrlAddToDisplayMini('%', finalRes.per);
              }
              auxPer++;
            }
  
            break;
  
          case 'plus':
            if (startOp === true && countOp === true) {
              ctrlAddInput('+');
              ctrlAddToDisplay('+');
              ctrlAddToDisplayMini('+');
              countOp = false;
              period = false;
            }
            break;
  
          case 'menus':
            if (startOp === true && countOp === true) {
              ctrlAddInput('-');
              ctrlAddToDisplay('-');
              ctrlAddToDisplayMini('-');
              countOp = false;
              period = false;
            }
            break;
  
          case 'divide':
            if (startOp === true && countOp === true) {
              ctrlAddInput('/');
              ctrlAddToDisplay('/');
              ctrlAddToDisplayMini('/');
              countOp = false;
              period = false;
            }
            break;
  
          case 'multiply':
            if (startOp === true && countOp === true) {
              ctrlAddInput('*');
              ctrlAddToDisplay('x');
              ctrlAddToDisplayMini('*');
              countOp = false;
              period = false;
            }
            break;
  
          case 'equal':
            if (startOp) {
              finalRes = ctrlAddInput('=');
              ctrlAddToDisplay('=', finalRes.result);
              ctrlAddToDisplayMini('=', finalRes.result);
              countOp = true;
              equalFlag = true;
              auxPer = 0;
              /\.+/g.test(finalRes.result) ? (period = true) : (period = false);
            }
            break;
        }
      });
    };
    let ctrlAddInput = (numberInput) => mathCtrl.addToMathCtrl(numberInput);
  
    let ctrlAddToDisplay = (toDisplay, result) =>
      uiCtrl.printIntoDisplay(toDisplay, result);
  
    let ctrlAddToDisplayMini = (toDisplayMini, result) =>
      uiCtrl.printIntoMiniDisplay(toDisplayMini, result);
  
    return {
      init: () => {
        console.log('Application has started');
        setupEventListeners(); 
      },
    };
  })(mathController, uiController);
  
  controller.init();  