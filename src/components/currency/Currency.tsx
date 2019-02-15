import React, { Component } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import "./currency.scss";
import { cache } from "../../lib/cache";

const apiKey = `2d33699c560793a723e61cd5f53a1351`;

const currencyVolutes = ["USD", "EUR", "RUB", "UAH", "RON", "GBP"];
const baseCurrency = "MDL";

interface UrlParams {
  [key: string]: string | number;
}

interface CurrencyProps {}

interface CurrencyDispatchProps {}

interface State {
  currencies: CurrencyItem[];
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

type Props = CurrencyProps & CurrencyDispatchProps;

async function getJson(url: string, params: UrlParams = {}) {
  const query = Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");

  const response = await fetch(url + query);

  return await response.json();
}

async function getCurrencyInfo() {
  const params: UrlParams = {
    access_key: apiKey,
    format: 1,
    currencies: baseCurrency + "," + currencyVolutes.join(","),
  };

  const url = `http://e-webdev.ru/ajax-cors/?url=http://www.apilayer.net/api/live&`;

  return await getJson(url, params);
}

class Currency extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currencies: [],
    };
  }

  componentDidMount = async () => {
    const currencyData = await cache("currencyData", async () => {
      return await getCurrencyInfo();
    });

    const main = currencyData.quotes[currencyData.source + baseCurrency];

    const currencies = currencyVolutes.map(currency => {
      const nominal = parseFloat((1).toFixed(2));
      const result = parseFloat(
        (main / currencyData.quotes[currencyData.source + currency]).toFixed(2),
      );
      const value = parseFloat(
        (main / currencyData.quotes[currencyData.source + currency]).toFixed(4),
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

  render() {
    return (
      <div className="currency">
        <div className="currency-header">
          <div className="title">Волюта</div>
          <div className="selected">MDL</div>
          <div className="rate">Курс</div>
        </div>
        {this.state.currencies.map((currency: CurrencyItem, index: number) => {
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
                />
              </div>
              <div className="value">{currency.value}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch): CurrencyDispatchProps => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Currency);
