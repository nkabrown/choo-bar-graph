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
      return { dataset: data.payload };
    }
  }
});

const view = (state, prev, send) => {
  return html`
    <svg></svg>
  `
}

app.router((route) => [
  route('/', view)
]);

const tree = app.start();
document.body.appendChild(tree);
