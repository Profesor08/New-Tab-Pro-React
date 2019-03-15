import React, { Component } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import "./currency.scss";
import { cache } from "../../lib/cache";
import { OptionsAppInitialState } from "../../store/reducers/optionsApp";

const apiKey = `2d33699c560793a723e61cd5f53a1351`;

const currencyVolutes = ["USD", "EUR", "RUB", "UAH", "RON", "GBP"];
const baseCurrency = "MDL";

interface UrlParams {
  [key: string]: string | number;
}

interface CurrencyProps {
  showCurrencyWidget: boolean;
}

interface CurrencyDispatchProps {}

interface CurrencyError {
  message: string;
}

interface CurrencyState {
  currencies: CurrencyItem[];
  error: CurrencyError | null;
}

interface CurrencyItem {
  formInitialNominal: string;
  formInitialResult: string;
  formNominal: string;
  formResult: string;
  name: string;
  nominal: number;
  result: number;
  value: number;
}

async function getJson(url: string, params: UrlParams = {}) {
  const query = Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");

  const response = await fetch(url + query);

  return await response.json();
}

interface CurrencyInfo {
  readonly success?: boolean;
  readonly error?: CurrencyInfoError;
  readonly source?: string;
  readonly quotes?: {
    readonly [key: string]: number;
  };
}

interface CurrencyInfoError {
  message: string;
}

async function getCurrencyInfo(): Promise<CurrencyInfo> {
  const params: UrlParams = {
    access_key: apiKey,
    format: 1,
    currencies: baseCurrency + "," + currencyVolutes.join(","),
  };

  try {
    const url = `http://www.apilayer.net/api/live?`;
    const currencyInfo: CurrencyInfo = await getJson(url, params);

    return currencyInfo;
  } catch (err) {
    console.warn("Error while getting the currency info:");
    console.warn(err);

    const error: CurrencyInfo = {
      success: false,
      error: {
        message: err.message,
      },
    };

    return error;
  }
}

class Currency extends Component<CurrencyProps, CurrencyState> {
  targetInput: HTMLTextAreaElement | null;
  loaded: boolean;

  constructor(props: CurrencyProps) {
    super(props);

    this.state = {
      currencies: [],
      error: null,
    };

    this.targetInput = null;

    this.loaded = false;
  }

  init = async () => {
    const currencyData: CurrencyInfo = await cache("currencyData", async () => {
      return await getCurrencyInfo();
    });

    if (currencyData.success) {
      if (currencyData.quotes !== undefined) {
        const quotes = currencyData.quotes;

        const main = quotes[currencyData.source + baseCurrency];

        const currencies = currencyVolutes.map(currency => {
          const nominal = parseFloat((1).toFixed(2));

          const result = parseFloat(
            (main / quotes[currencyData.source + currency]).toFixed(2),
          );
          const value = parseFloat(
            (main / quotes[currencyData.source + currency]).toFixed(4),
          );

          return {
            name: currency,
            nominal: nominal,
            result: result,
            formNominal: nominal.toFixed(2),
            formResult: result.toFixed(2),
            formInitialNominal: nominal.toFixed(2),
            formInitialResult: result.toFixed(2),
            value: value,
          };
        });

        this.setState({
          currencies,
        });
      }
    } else if (currencyData.error) {
      this.setState({
        error: {
          message: currencyData.error.message,
        },
      });
    }

    this.loaded = true;
  };

  componentDidMount = async () => {
    if (this.props.showCurrencyWidget === true) {
      await this.init();
    }
  };

  componentWillReceiveProps = async (nextProps: CurrencyProps) => {
    if (nextProps.showCurrencyWidget === true) {
      if (this.loaded === false) {
        await this.init();
      }
    }
  };

  nominalChange = (index: number, value: number) => {
    const currencies = this.state.currencies;

    if (isNaN(value) === false) {
      currencies[index].result = parseFloat(
        (value * currencies[index].value).toFixed(2),
      );
      currencies[index].formNominal = value.toString();
      currencies[index].formResult = currencies[index].result.toFixed(2);
    } else {
      currencies[index].formNominal = "";
    }

    this.setState({
      currencies,
    });
  };

  resultChange = (index: number, value: number) => {
    const currencies = this.state.currencies;

    if (isNaN(value) === false) {
      currencies[index].nominal = parseFloat(
        (value / currencies[index].value).toFixed(2),
      );
      currencies[index].formResult = value.toString();
      currencies[index].formNominal = currencies[index].nominal.toFixed(2);
    } else {
      currencies[index].formResult = "";
    }

    this.setState({
      currencies,
    });
  };

  restoreInputValue = (index: number, type: "result" | "nominal") => {
    const currencies = this.state.currencies;

    if (type === "result") {
      if (currencies[index].formResult.length === 0) {
        currencies[index].formResult = currencies[index].result.toFixed(2);
      }
    } else if (type === "nominal") {
      if (currencies[index].formNominal.length === 0) {
        currencies[index].formNominal = currencies[index].nominal.toFixed(2);
      }
    }

    this.targetInput = null;

    this.setState({
      currencies,
    });
  };

  clearInputValue = (index: number, type: "result" | "nominal") => {
    const currencies = this.state.currencies;

    if (type === "result") {
      if (
        currencies[index].formResult === currencies[index].formInitialResult
      ) {
        currencies[index].formResult = "";
      }
    } else if (type === "nominal") {
      if (
        currencies[index].formNominal === currencies[index].formInitialNominal
      ) {
        currencies[index].formNominal = "";
      }
    }

    this.setState({
      currencies,
    });
  };

  selectInput = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLTextAreaElement;

    if (target.isSameNode(this.targetInput) === false) {
      target.select();
    }

    this.targetInput = target;
  };

  render() {
    if (this.props.showCurrencyWidget === false) {
      return null;
    }

    if (!this.state.error) {
      return (
        <div className="currency">
          <div className="currency-header">
            <div className="title">Волюта</div>
            <div className="selected">MDL</div>
            <div className="rate">Курс</div>
          </div>
          {this.state.currencies.map(
            (currency: CurrencyItem, index: number) => {
              return (
                <div className="currency-row" key={index}>
                  <div className="nominal">
                    <div className="name">{currency.name}</div>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={currency.formNominal}
                      onChange={e =>
                        this.nominalChange(index, parseFloat(e.target.value))
                      }
                      onBlur={e => this.restoreInputValue(index, "nominal")}
                      onClick={e => this.selectInput(e)}
                    />
                  </div>
                  <div className="result">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={currency.formResult}
                      onChange={e =>
                        this.resultChange(index, parseFloat(e.target.value))
                      }
                      onBlur={e => this.restoreInputValue(index, "result")}
                      onClick={e => this.selectInput(e)}
                    />
                  </div>
                  <div className="value">{currency.value}</div>
                </div>
              );
            },
          )}
        </div>
      );
    } else {
      console.warn("Unable to draw currency component");
      console.warn(this.state.error.message);
      return null;
    }
  }
}

interface State {
  optionsApp: OptionsAppInitialState;
}

const mapStateToProps = (state: State): CurrencyProps => {
  return {
    showCurrencyWidget: state.optionsApp.showCurrencyWidget,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): CurrencyDispatchProps => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Currency);
