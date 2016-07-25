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

const y = scale.scaleLinear()
    .domain([0, 0.12702])
    .range([height, 0]);

app.model({
  state: { dataset: [] },
  subscriptions: [
    (send, done) => {
      request.tsv('data.tsv', type, data => {
        send('load', { payload: data }, (err) => {
          if (err) return done(err);
        });
        send('print', { payload: data }, (err) => {
          if (err) return done(err);
        });
      });

      function type(d) {
        d.frequency = +d.frequency;
        return d;
      }
    }
  ],
  effects: {
    print: (data, state) => console.log(data.payload)
  },
  reducers: {
    load: (data, state) => {
      return { dataset: data.payload, max: Math.max(...data.payload.map(datum => datum.frequency)), barWidth: width / data.payload.length };
    }
  }
});

const view = (state, prev, send) => {
  const bars = state => html`
    ${state.dataset.map((el, i) => html`
      <g transform="translate(${i * state.barWidth}, 0)" key=${el.letter}>
        <rect class="bar" y=${y(el.frequency)} height=${height - y(el.frequency)} width=${state.barWidth - 1}/>
        <text text-anchor="middle" x=${state.barWidth / 2} y=${y(el.frequency) + 3} dy=".71em">
          ${el.letter}
        </text>
      </g>`
      )}
  `;

  return html`
    <main>
      <svg width=${width} height=${height}>
        ${bars(state)}
      </svg>
    </main>`

}


app.router((route) => [
  route('/', view)
]);

const tree = app.start();
document.body.appendChild(tree);
