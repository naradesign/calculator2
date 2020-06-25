(function () {
  'use strict'

  // TEST CASE:
  // 1+2 [2]
  // 1+2= [3]
  // 1+2== [5]
  // 1+2=== [7]
  // 1+2+ [3]
  // 1+2+= [6]
  // 1+2+-= [0]
  // 1+2+9- [12]

  const outputElement = document.getElementById('output')
  const inputElement = document.getElementsByClassName('calc__input')[0]
  const clearElement = document.getElementsByClassName('calc__clear')[0]
  const numberElement = document.getElementsByClassName('calc__number')[0]
  const operatorElement = document.getElementsByClassName('calc__operator')[0]

  bindEvent()

  function bindEvent () {
    clearElement.addEventListener('click', event => clearOutput())
    document.addEventListener('keyup', event => event.keyCode === 27 && clearOutput())
    inputElement.addEventListener('click', event => setLastKey(event))
    numberElement.addEventListener('click', event => setValueByContext(event))
    operatorElement.addEventListener('click', event => setCalulator(event))
  }

  function setLastKey (event) { // 사용자 의도를 파악하기 위해 마지막 키를 저장
    outputElement.dataset.lastkey = event.target.innerHTML

    event.keyCode === 27 && console.log('key: ' + clearElement.innerHTML) // TODO: 삭제

    if (/\+|\-|\×|\÷|\=/.test(event.target.innerHTML)) { // TODO: 삭제
      console.log('key: ' + event.target.innerHTML)
    }
  }

  function clearOutput () { // 초기화
    outputElement.dataset.value1 = '0'
    outputElement.dataset.value2 = '0'
    outputElement.dataset.operator = ''
    outputElement.innerHTML = '0'

    console.log('output: ' + outputElement.innerHTML) // TODO: 삭제
  }

  // 입력 받은 숫자는 맥락을 따져 value1 또는 value2 중 하나의 값으로 설정
  function setValueByContext (event) {
    const numberString = event.target.innerHTML

    outputElement.dataset.lastkey === '=' && clearOutput() // 마지막 키가 '=' 였다면 초기화

    // 사칙 연산을 입력했는지 여부에 따라 다른 위치에 값을 채움
    !outputElement.dataset.operator
      ? printNumber(numberString, 'value1')
      : printNumber(numberString, 'value2')
  }

  function printNumber (numberString, value) {
    if (outputElement.dataset[value].length >= 10) { // 10자리 이상이면 리턴
      return
    }

    // 소수점을 연속으로 찍는 경우 리턴
    if (numberString === '.' && /\./.test(outputElement.dataset[value])) {
      return
    }

    if (/\d|\./.test(outputElement.dataset.lastkey)) { // 마지막 키가 숫자였다면 기존 값에 새 값을 추가
      outputElement.dataset[value] += numberString
    } else { // 마지막 키가 사칙 연산자였다면 새 값으로 덮어 쓰기
      outputElement.dataset[value] = numberString
    }

    if (/^0\d/.test(outputElement.dataset[value])) { // 0으로 시작하면 0을 삭제
      outputElement.dataset[value] = outputElement.dataset[value].replace(/^0/, '')
    }

    // 콤마를 표시하기 위해 소수점 기준으로 분리 후 배열에 담기
    const valueArray = outputElement.dataset[value].split('.')

    valueArray[0] = parseFloat(valueArray[0]).toLocaleString() // 정수 3자리마다 콤마를 표시
    outputElement.innerHTML = valueArray.join('.') // 소수점 연결 후 출력

    console.log('output: ' + outputElement.innerHTML) // TODO: 삭제
  }

  function setCalulator (event) {
    const operator4thArray = ['+', '-', '×', '÷']
    const currentOperator = event.target.innerHTML
    const isLastKey4thOperator = operator4thArray.indexOf(outputElement.dataset.lastkey) > -1 // 마지막 키가 사칙 연산자
    const isCurrentKey4thOperator = operator4thArray.indexOf(currentOperator) > -1 // 현재 키가 사칙 연산자
    const last4thOperator = outputElement.dataset.operator

    // 설정한 연산자가 없거나 || 사칙 연산을 중복으로 누른 경우
    if (!last4thOperator || (isLastKey4thOperator && isCurrentKey4thOperator)) {
      outputElement.dataset.operator = currentOperator // 마지막 연산자만 설정하고 리턴
      return
    }

    if (isLastKey4thOperator && currentOperator === '=') { // 사칙 연산 이후 결과 키를 누르면
      outputElement.dataset.value2 = outputElement.dataset.value1 // 화면에 보이는 value1 값을 두 번째 값으로 복사
    }

    const value1 = outputElement.dataset.value1
    const value2 = outputElement.dataset.value2
    const resultValue = calculate(last4thOperator, value1, value2)

    outputElement.dataset.value1 = resultValue // 계산 결과를 value1에 저장
    outputElement.innerHTML = resultValue.toLocaleString() // 계산 결과에 콤마 추가해서 화면에 출력

    setTimeout(() => { // TODO: 삭제
      console.log('output: ' + outputElement.innerHTML)
    }, 0)

    if (isCurrentKey4thOperator) { // 사칙 연산자를 클릭했다면 사칙 연산자를 저장
      outputElement.dataset.operator = currentOperator
    }
  }

  function calculate (operator, value1, value2) {
    if (operator === '+') {
      return parseFloat(value1) + parseFloat(value2)
    } else if (operator === '-') {
      return parseFloat(value1) - parseFloat(value2)
    } else if (operator === '×') {
      return parseFloat(value1) * parseFloat(value2)
    } else if (operator === '÷') {
      return parseFloat(value1) / parseFloat(value2)
    }
  }
})()
