<template>
  <div class="container-fluid mt-5">
    <h1 class="text-center mb-4">{{ title }}</h1>
    <div class="row">
      <div class="col" id="backtest-form">
        <form @submit.prevent="runBacktest">
          <h1>Backtest</h1>
          <div class="form-group">
            <label for="initial-investment">Initial Investment</label>
            <input
              type="number"
              class="form-control"
              v-model="initialInvestment"
              id="initial-investment"
              required
            />
          </div>
          <div class="form-group">
            <label for="short-window">
              Buy when price dips below moving average (e.g. 50-day average)
            </label>
            <input
              type="number"
              class="form-control"
              v-model="shortWindow"
              id="short-window"
              required
            />
          </div>
          <div class="form-group">
            <label for="long-window">
              Sell when price goes above moving average (e.g. 200-day average)
            </label>
            <input
              type="number"
              class="form-control"
              v-model="longWindow"
              id="long-window"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Run Backtest</button>
        </form>
        <div id="backtest-result" class="alert" role="alert">{{ backtestResult }}</div>
      </div>
      <form @submit.prevent="fetchStockData">
		<div class="row mb-3">
			<div class="col-md-6 offset-md-3">
				<div class="form-floating">
					<input
						type="text"
						class="form-control"
						name="stock-symbol"
						id="stock-symbol"
						placeholder="AAPL"
						autocomplete="off"
						required
					/>
					<label for="stock-symbol">Stock Symbol</label>
					<div class="invalid-feedback">Please enter a stock symbol.</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6 offset-md-3 text-center">
				<button type="submit" class="btn btn-success btn-lg">Search</button>
			</div>
		</div>
	</form>
      <table class="table col">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Open</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Close</th>
            <th scope="col">Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, k) in stockData" :key="k">
            <td scope="row">{{ k }}</td>
            <td scope="row">{{ v.open }}</td>
            <td scope="row">{{ v.high }}</td>
            <td scope="row">{{ v.low }}</td>
            <td scope="row">{{ v.close }}</td>
            <td scope="row">{{ v.volume }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
  data() {
    return {
      title: 'Daily Stock Price',
      initialInvestment: '',
      shortWindow: '',
      longWindow: '',
      backtestResult: '',
      stockData: {},
    }
  },
  methods: {
    async runBacktest() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/backtest', {
          params: {
            'initial-investment': this.initialInvestment,
            'short-window': this.shortWindow,
            'long-window': this.longWindow,
          },
        })
        this.backtestResult = response.data.total_return
      } catch (error) {
        console.error(error)
      }
    },
    async fetchStockData() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/getstockdata')
        this.stockData = response.data
      } catch (error) {
        console.error(error)
      }
    },
  },
//   mounted() {
//     this.fetchStockData()
//   },
}
</script>
<!-- <script>
	const backtestForm = document.getElementById("backtest-form");
	backtestForm.addEventListener("submit", (e) => {
	  e.preventDefault();
	  const csrftoken = document.querySelector(
		"[name=csrfmiddlewaretoken]"
	  ).value;
	  // http://127.0.0.1:8000/backtest?csrfmiddlewaretoken=a7zGtlEZwUjYEiZ53RGjCjWwmzd7hMwUCggtflSXQ2US2cxp3FHnpJ7ZmQu2fTrH&initial-investment=400&short-window=123&long-window=321
	  const url = `http://127.0.0.1:8000/backtest?csrfmiddlewaretoken=${csrftoken}&initial-investment=${document.getElementById("initial-investment").value}&short-window=${document.getElementById("short-window").value}&long-window=${document.getElementById("long-window").value}`;
	  
	  fetch(url)
		.then((data) => {
		  if (!data.ok) {
			throw Error(data.status);
		  }
		  return data.json();
		})
		.then((update) => {
		  console.log(update);
		  document.getElementById("backtest-result").innerText = update.total_return;
		})
		.catch((e) => {
		  console.log(e);
		});
	});
  </script> -->

<style scoped>
.container {
  max-width: 800px;
}
</style>
