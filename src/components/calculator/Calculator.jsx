import React from "react";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDivide } from "@fortawesome/free-solid-svg-icons";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { faPercentage } from "@fortawesome/free-solid-svg-icons";
import { faSubtract } from "@fortawesome/free-solid-svg-icons";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: "",
      number: 0,
      preview: "0",
      decimal: false,
      operator: false,
      expressionHistory: [],
      result: false,
      operatorCount: 0,
      minus4b: 0,
      percentage: true,
      showingError: false,
      activeButton: null,
    };
    this.evalExpression = this.evalExpression.bind(this);
    this.allClear = this.allClear.bind(this);
    this.decimal = this.decimal.bind(this);
    this.numbers = this.numbers.bind(this);
    this.percentage = this.percentage.bind(this);
    this.setOperation = this.setOperation.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  evalExpression() {
    let expression = this.state.expression;
    if (
      expression.includes("+%") ||
      expression.includes("-%") ||
      expression.includes("*%") ||
      expression.includes("/%") ||
      expression.includes("%+") ||
      expression.includes("%-") ||
      expression.includes("%*") ||
      expression.includes("%/") ||
      expression.startsWith("%")
    ) {
      this.setState({
        expression: "Format Error",
        preview: "",
        showingError: true,
      });
    } else if (expression === "" || this.state.result) {
      return;
    } else {
      if (expression[0] === "*" || expression[0] === "/") {
        expression = expression.slice(1);
      }
      if (["+", "-", "*", "/"].includes(expression.slice(-1))) {
        expression = expression.slice(0, -1);
      }

      if (expression.endsWith("%")) {
        let value = parseFloat(expression.slice(0, -1));
        if (!isNaN(value)) {
          expression = value + "/100";
        }
      }
      let result = eval(expression);
      result = Number(result.toFixed(4));
      this.setState({
        result: true,
        expression: expression + " = " + result,
        preview: result,
        operatorCount: 0,
        percentage: true,
      });
    }
  }
  // 5 + 5 = + 3 = 13
  allClear() {
    this.setState({
      expression: "",
      number: 0,
      preview: "0",
      decimal: false,
      operator: false,
      expressionHistory: [],
      result: false,
      operatorCount: 0,
      percentage: true,
    });
  }
  setOperation(operator) {
    const isMinusSign = operator === "-";
    const lastChar = this.state.expression.slice(-1);
    const isLastCharOperator =
      lastChar === "+" ||
      lastChar === "-" ||
      lastChar === "*" ||
      lastChar === "/";

    if (!this.state.number) {
      console.log("X");
      this.setState((prevState) => ({
        expression: isLastCharOperator
          ? "" + prevState.expression.slice(0, -1) + operator
          : prevState.expression === ""
          ? "" + operator
          : "" + prevState.preview + operator,
        preview: operator,
        operator: true,
        result: false,
        number: 0,

        showingError: false,
        percentage: true,

        expressionHistory: [
          ...prevState.expressionHistory,
          prevState.expression,
        ],
      }));
    } else if (this.state.operatorCount <= 1 && !isMinusSign) {
      console.log("A");
      this.setState((prevState) => ({
        expression: this.state.showingError
          ? "" + operator
          : this.state.result
          ? "" + this.state.preview + operator
          : ["+", "-", "*", "/"].includes(this.state.expression.slice(-1))
          ? "" + this.state.expression.slice(0, -1) + operator
          : "" + this.state.expression + operator,
        preview: "" + operator,
        operator: true,
        result: false,
        operatorCount: 1,

        showingError: false,
        percentage: true,
        expressionHistory: [
          ...prevState.expressionHistory,
          prevState.expression,
        ],
      }));
    } else if (
      this.state.number &&
      isMinusSign &&
      this.state.minus4b <= 1 &&
      this.state.operatorCount <= 1
    ) {
      // console.log("B");
      this.setState(
        {
          expression: this.state.result
            ? this.state.preview + operator
            : this.state.expression + operator,
          preview: operator,
          operator: true,
          minus4b: this.state.minus4b + 1,
          operatorCount: this.state.operatorCount + 1,
          result: false,
          expressionHistory: [
            ...this.state.expressionHistory,
            this.state.expression,
          ],
        }
        // () => {
        //   console.log(this.state.expressionHistory);
        // }
      );
    } else if (this.state.operatorCount === 2) {
      // console.log("C");
      this.setState({
        expression: this.state.expression.slice(0, -2) + operator,
        preview: "" + operator,
        operatorCount: 1,
        minus4b: 0,
      });
    }
  }
  numbers(value) {
    const latestExpression =
      this.state.expressionHistory[this.state.expressionHistory.length - 1];
    if (this.state.operator) {
      this.setState({
        preview: "",
        decimal: false,
        operatorCount: 0,
        minus4b: 0,
      });
    }
    if (this.state.showingError) {
      this.setState({
        expression: "",
        showingError: false,
        percentage: true,
      });
    }

    this.setState(
      (prevState) => ({
        expressionHistory: !prevState.expressionHistory.includes(
          prevState.expression
        )
          ? [...prevState.expressionHistory, prevState.expression]
          : prevState.expressionHistory,
        expression:
          prevState.expression === "0" && prevState.number >= 1 && value === 0
            ? "0"
            : prevState.preview === "0" &&
              !prevState.operator &&
              prevState.number === 1
            ? latestExpression + value
            : prevState.expression === "0" &&
              prevState.number >= 1 &&
              value === 0 &&
              !prevState.operator
            ? "0"
            : prevState.expression === "0" && prevState.preview === "0"
            ? "" + value
            : value === 0 &&
              prevState.preview === "0" &&
              !prevState.operator &&
              prevState.expression !== ""
            ? prevState.expression + ""
            : value !== 0 &&
              prevState.preview === "0" &&
              !prevState.operator &&
              prevState.expression !== ""
            ? this.state.expressionHistory[
                this.state.expressionHistory.length - 1
              ] + value
            : this.state.result
            ? "" + value
            : prevState.expression + value,
        preview:
          prevState.expression === "0" && prevState.number >= 1 && value === 0
            ? "0"
            : prevState.preview === "0" &&
              !prevState.operator &&
              prevState.number === 1
            ? "" + value
            : prevState.expression === "0" && prevState.preview === "0"
            ? "" + value
            : prevState.expression === "" && prevState.preview === "0"
            ? prevState.expression + value
            : value === 0 &&
              prevState.preview === "0" &&
              !prevState.operator &&
              prevState.expression !== ""
            ? value + ""
            : value !== 0 &&
              prevState.preview === "0" &&
              !prevState.operator &&
              prevState.expression !== ""
            ? value + ""
            : this.state.result
            ? "" + value
            : prevState.preview + value,
        result: false,
        operator: false,
        number: prevState.number + 1,
      })
      // () => {
      //   console.log(this.state.expressionHistory);
      //   console.log(this.state.number);
      // }
    );
  }

  decimal() {
    if (this.state.expression === "") {
      this.setState({
        expression: "0.",
        preview: "0.",
        decimal: true,
      });
    } else if (!this.state.decimal && !this.state.operator) {
      this.setState((prevState) => ({
        expression: prevState.expression + ".",
        preview: prevState.preview + ".",
        decimal: true,
      }));
    } else if (this.state.operator) {
      this.setState({
        expression: this.state.expression + "0.",
        preview: "0.",
        decimal: true,
        operator: false,
      });
    }
  }
  percentage() {
    if (this.state.percentage) {
      this.state.percentage = false;
      if (this.state.result) {
        this.setState((prevState) => ({
          expression: prevState.preview + "%",
          preview: "%",
          result: false,
        }));
      } else {
        this.setState({
          expression: this.state.expression + "%",
          preview: "%",
        });
      }
    }
  }
  handleClick = (buttonId) => {
    this.setState({ activeButton: buttonId });

    setTimeout(() => {
      if (buttonId === 99) {
        const githubProfile = "https://github.com/rvif";
        window.open(githubProfile, "_blank");
      }
      setTimeout(() => {
        this.setState({ activeButton: null });
      }, 80);
    }, 0); // confirms timeout in next tick
  };

  render() {
    const { activeButton } = this.state;
    return (
      <div className="interface bg-black h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="wrapper w-[300px] sm:w-[350px] h-[534px] border-solid border-orange-700 border-[.5px] rounded-3xl">
          <div className="w-full h-24 border-solid border-orange-700 border-b-[0px] flex items-end justify-end overflow-x-auto">
            <h1 className="text-white font-roboto font-extrabold text-[28px] mr-4 ml-4">
              {this.state.expression}
            </h1>
          </div>

          <div
            id="display"
            className="pr-5 text-gray-600 font-roboto font-extrabold text-[20px] w-full h-12 border-solid border-orange-700 border-b-[0px] flex items-end overflow-x-auto justify-end"
          >
            {this.state.preview}
          </div>
          <div className="button-section sm:w-[350px] w-[300px] h-full">
            <div className="buttons w-full mb-1 flex justify-center">
              <button
                onClick={() => {
                  this.allClear();
                  this.handleClick(1);
                }}
                id="clear"
                className={`${
                  activeButton === 1 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="text-orange-500 font-roboto font-extrabold select-none">
                  AC
                </h1>
              </button>
              <button className="invisible w-[50px] h-[50px] rounded-3xl bg-gray-400 m-3"></button>
              <button
                onClick={() => {
                  this.percentage();
                  this.handleClick(2);
                }}
                id="percentage"
                className={`${
                  activeButton === 2 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <FontAwesomeIcon
                  className="text-orange-500 font-semibold select-none"
                  icon={faPercentage}
                />
              </button>
              <button
                onClick={() => {
                  this.handleClick(3);
                  this.setOperation("/");
                }}
                id="divide"
                className={`${
                  activeButton === 3 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <FontAwesomeIcon
                  className="text-orange-500 font-semibold select-none"
                  icon={faDivide}
                />
              </button>
            </div>
            <div className="buttons mb-1 flex justify-center">
              <button
                onClick={() => {
                  this.handleClick(4);
                  this.numbers(7);
                }}
                id="seven"
                className={`${
                  activeButton === 4 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  7
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(5);
                  this.numbers(8);
                }}
                id="eight"
                className={`${
                  activeButton === 5 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  8
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(6);
                  this.numbers(9);
                }}
                id="nine"
                className={`${
                  activeButton === 6 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  9
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(7);
                  this.setOperation("*");
                }}
                id="multiply"
                className={`${
                  activeButton === 7 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <FontAwesomeIcon
                  className="text-orange-500 font-semibold"
                  icon={faMultiply}
                />
              </button>
            </div>
            <div className="buttons mb-1 flex justify-center">
              <button
                onClick={() => {
                  this.handleClick(8);
                  this.numbers(4);
                }}
                id="four"
                className={`${
                  activeButton === 8 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  4
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(9);
                  this.numbers(5);
                }}
                id="five"
                className={`${
                  activeButton === 9 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  5
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(10);
                  this.numbers(6);
                }}
                id="six"
                className={`${
                  activeButton === 10 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  6
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(11);
                  this.setOperation("-");
                }}
                id="subtract"
                className={`${
                  activeButton === 11 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <FontAwesomeIcon
                  className="text-orange-500 font-semibold select-none"
                  icon={faSubtract}
                />
              </button>
            </div>
            <div className="buttons mb-1 flex justify-center">
              <button
                onClick={() => {
                  this.handleClick(12);
                  this.numbers(1);
                }}
                id="one"
                className={`${
                  activeButton === 12 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1
                  className="font-roboto text-orange-500 font-extrabold select-none"
                  select-none
                >
                  1
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(13);
                  this.numbers(2);
                }}
                id="two"
                className={`${
                  activeButton === 13 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  2
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(14);
                  this.numbers(3);
                }}
                id="three"
                className={`${
                  activeButton === 14 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  3
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(15);
                  this.setOperation("+");
                }}
                id="add"
                className={`${
                  activeButton === 15 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <FontAwesomeIcon
                  className="text-orange-500 font-semibold select-none"
                  icon={faAdd}
                />
              </button>
            </div>
            <div className="buttons mb-1 flex justify-center items-center">
              <button
                className={`${
                  activeButton === 99 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
                id="support"
                onClick={() => {
                  this.handleClick(99);
                }}
              >
                <FontAwesomeIcon
                  className="text-orange-500 select-none"
                  icon={faHeart}
                />
              </button>
              <button
                id="zero"
                onClick={() => {
                  this.handleClick(16);
                  this.numbers(0);
                }}
                className={`${
                  activeButton === 16 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold select-none">
                  0
                </h1>
              </button>
              <button
                onClick={() => {
                  this.handleClick(17);
                  this.decimal();
                }}
                id="decimal"
                className={`${
                  activeButton === 17 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1 className="font-roboto text-orange-500 font-extrabold text-[20px] select-none">
                  .
                </h1>
              </button>
              <button
                id="equals"
                onClick={() => {
                  this.handleClick(18);
                  this.evalExpression();
                }}
                className={`${
                  activeButton === 18 ? "bg-[#a9a9a91d]" : "bg-black"
                } w-[50px] h-[50px] rounded-3xl m-3`}
              >
                <h1
                  id="4testcase"
                  className="text-orange-500 text-[26px] pb-1 font-semibold select-none"
                >
                  =
                </h1>
                {/* <FontAwesomeIcon
                  className="text-orange-500 font-semibold select-none"
                  icon={faEquals}
                /> */}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Calculator;
