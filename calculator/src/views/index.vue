<template>
  <div class="calculator">
    <div class="display">{{ currentNumber }}</div>
    <div class="buttons">
      <button class="clear-button" @click="clear()">C</button>
      <button @click="handleButtonClick('/')">/</button>
      <button @click="handleButtonClick('*')">*</button>
      <button class="delete-button" @click="deleteLastCharacter()">&larr;</button>
      <button v-for="button in buttons" :key="button.value" @click="handleButtonClick(button.value)">
        {{ button.label }}
      </button>
      <button @click="performTrigonometricFunction('sin')">sin</button>
      <button @click="performTrigonometricFunction('cos')">cos</button>
      <button @click="performTrigonometricFunction('tan')">tan</button>
      <button @click="calculateSquareRoot()">√￣</button>
      <button class="ans-button" @click="showHistory()">ans</button>
      <button class="equal-button" @click="calculate()">=</button>
    </div>
  </div>
  <a-drawer
    v-model:visible="showHistoryFlag"
    title="操作历史"
    placement="right"
  >
    <a-timeline>
      <a-timeline-item v-for="history in historyData">
        <p> 操作记录：{{ history.message }}</p>
        <p> 操作时间：{{ history.createTime }}</p>
      </a-timeline-item>
    </a-timeline>
  </a-drawer>
</template>

<script setup>
import { ref } from "vue";
import calculatorApi from "@/api/calculator/calculatorApi.js";
import { message } from "ant-design-vue";

const showHistoryFlag = ref(false);
const historyData = ref([]);
const currentNumber = ref("0");
const buttons = [
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "-", value: "-" },

  { label: "4", value: 4 },
  { label: "6", value: 6 },
  { label: "5", value: 5 },
  { label: "+", value: "+" },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: ".", value: "." },
  { label: "%", value: "%" },
  { label: "0", value: 0 }
];

const handleButtonClick = (value) => {
  if (currentNumber.value === "0") {
    currentNumber.value = "";
  }
  if (value === "/" && currentNumber.value === "") {
    currentNumber.value = "0";
  }
  currentNumber.value += value;
};

const calculate = () => {
  let message = currentNumber.value;
  try {
    currentNumber.value = eval(currentNumber.value);
  } catch (error) {
    currentNumber.value = "Error";
  }
  if (message == currentNumber.value) {
    return;
  }
  message = message + "=" + currentNumber.value;
  saveHistory(message);
};

const clear = () => {
  currentNumber.value = "0";
};

const deleteLastCharacter = () => {
  currentNumber.value = currentNumber.value.slice(0, -1);
};

// 开根号
const calculateSquareRoot = () => {
  const value = parseFloat(currentNumber.value);
  let message = currentNumber.value;
  if (!isNaN(value)) {
    currentNumber.value = Math.sqrt(value).toFixed(2);
    console.log("message", message);
  } else {
  }
  message = "√(" + message + ")=" + currentNumber.value;
  saveHistory(message);
};

// 三角函数
const performTrigonometricFunction = (func) => {
  let message = currentNumber.value;
  const value = parseFloat(currentNumber.value);
  if (!isNaN(value)) {
    var radian = value * Math.PI.toFixed(2) / 180;
    let result = "";
    switch (func) {
      case "sin":
        currentNumber.value = Math.sin(radian).toFixed(2);
        result = "sin(" + message + ") = " + currentNumber.value;
        break;
      case "cos":
        currentNumber.value = Math.cos(radian).toFixed(2);
        result = "cos(" + message + ") = " + currentNumber.value;
        break;
      case "tan":
        currentNumber.value = Math.tan(radian).toFixed(2);
        result = "tan(" + message + ") = " + currentNumber.value;
        break;
    }
    saveHistory(result);
  } else {
    currentNumber.value = "Error";
    let result = func + "(" + message + ") = " + currentNumber.value;
    saveHistory(result);
  }
};

// 展示历史数据
const showHistory = () => {
  listHistoryLastTen();
  showHistoryFlag.value = true;
};

// 查询最近十条
const listHistoryLastTen = () => {
  calculatorApi.listHistoryLastTen().then(({ data }) => {
    if (data.code === 200) {
      historyData.value = data.data;
    } else {
      message.error(data.message);
    }
  }).catch(err => {
    console.log(err);
  });
};

// 保存历史记录
const saveHistory = (message) => {
  let params = {
    message: message
  };

  calculatorApi.insert(params).then(({ data }) => {
    if (data.code === 200) {
      historyData.value = data.data;
    } else {
      message.error(data.message);
    }
  }).catch(err => {
    console.log(err);
  });
};


</script>

<style scoped>
.calculator {
  width: 300px;
  margin: 200px auto 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  padding: 10px;
}

.display {
  height: 60px;
  line-height: 60px;
  border: none;
  border-radius: 5px;
  text-align: right;
  font-size: 24px;
  background-color: #fff;
  padding: 0 20px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

button {
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 5px;
  background-color: #fff;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #f1f1f1;
}

.equal-button {
  background-color: #ff9800;
  color: #fff;
  //grid-column: span 2;
}

.ans-button {
  background-color: dodgerblue;
}

.equal-button:hover {
  background-color: #f57c00;
}

.clear-button {
  background-color: #f44336;
  color: #fff;
}

.clear-button:hover {
  background-color: #d32f2f;
}

.delete-button {
  background-color: #ccc;
  color: #555;
}

.delete-button:hover {
  background-color: #bbb;
}
</style>
