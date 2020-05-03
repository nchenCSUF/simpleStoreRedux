/* NOTE: DON'T BUILD APPS LIKE THIS! */
import { h, render, Component } from "preact";
import imageSearch from "./image-search";
import { createStore } from "redux";

// our starting redux state
const initialState = {
  query: "",
  fetching: false,
  results: []
};

// our simple reducer only has two actions to handle
const reducer = (state = initialState, action) => {
  if (action.type === "IMAGE_SEARCH_STARTED") {
    return Object.assign({}, state, {
      query: action.payload,
      fetching: true
    });
  }

  if (action.type === "IMAGE_SEARCH_FINISHED") {
    return Object.assign({}, state, {
      results: action.payload,
      fetching: false
    });
  }

  // always return state
  return state;
};

// here we create our redux store instance.
const store = createStore(reducer);

// A component for rendering the right content
const Content = ({ state }) => {
  const { query, fetching, results } = state;

  if (!query && !fetching) {
    return null;
  }

  if (fetching) {
    return <p>Searching for images of {query}...</p>;
  }

  if (results.length) {
    return (
      <ul>
        {results.map(result => (
          <li>
            <img src={result.url} />
          </li>
        ))}
      </ul>
    );
  }

  return <p>No images found for {query}</p>;
};

class App extends Component {
  constructor(props) {
    super(props);
    const store = props.store;
    // grab our starting state
    this.state = store.getState();

    // subscribe to our store
    store.subscribe(() => {
      // set the result to component state
      this.setState(store.getState());
    });
  }

  updateSearchQuery(query) {
    const store = this.props.store;
    store.dispatch({ type: "IMAGE_SEARCH_STARTED", payload: query });

    // start our image search
    imageSearch(query).then(results => {
      store.dispatch({ type: "IMAGE_SEARCH_FINISHED", payload: results });
    });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const query = e.target[0].value;
            e.target[0].value = "";
            this.updateSearchQuery(query);
          }}
        >
          <label>What do you want to search for?</label>
          <input type="text" name="search" />
          <button type="submit">Search</button>
        </form>
        <Content state={this.state} />
      </div>
    );
  }
}

render(<App store={store} />, null, document.body);
