const chooLog = require('choo-log');
const choo = require('choo');
const html = require('choo/html');
const scale = require('d3-scale');
const request = require('d3-request');

const logger = chooLog();
const app = choo({
  onAction: logger.onAction,
  onError: logger.onError,
  onStateChange: logger.onStateChange
});

const width = 960;
const height = 500;

app.model({
  state: { dataset: [] },
  subscriptions: [
    (send, done) => {
      request.tsv('data.tsv', data => {
        send('load', { payload: data }, (err) => {
          if (err) return done(err);
        });
        send('print', { payload: data }, (err) => {
          if (err) return done(err);
        });
      });
    }
  ],
  effects: {
    print: (data, state) => console.log(data.payload)
  },
  reducers: {
    load: (data, state) => {
      return { dataset: data.payload, max: Math.max(...data.payload.map(datum => datum.frequency)), barWidth: width / data.payload.length, y: scale.scaleLinear().domain([0, state.max]).range([height, 0]) };
    }
  }
});

const view = (state, prev, send) => {
  return html`
    <main>
      <svg width=${width} height=${height}>
      </svg>
    </main>`
}

app.router((route) => [
  route('/', view)
]);

const tree = app.start();
document.body.appendChild(tree);
