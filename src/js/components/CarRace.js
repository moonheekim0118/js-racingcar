import Component from "../core/component.js";
import Car from "./Car.js";

let interval;
class CarRace extends Component {
  constructor($root, props, handlers) {
    super();
    this.$root = $root;
    this.props = props;
    this.handlers = handlers;

    this.state = {
      winners: [],
      carInfos: [],
      count: 0,
    };
  }

  mount() {
    if (!this.props.isStarted) {
      this.$root.innerHTML = "";
      return;
    } else if (this.props.isStarted && !this.props.isEnded) {
      this.handleAddCars();
    }
  }

  handleAddCars() {
    this.children = this.props.cars.map((car) => {
      const $container = document.createElement("div");
      $container.className = "mr-2";
      this.$root.appendChild($container);
      return new Car(
        $container,
        {
          name: car,
          time: this.props.time,
        },
        {
          onArrive: this.handleArrive.bind(this),
        }
      );
    });
    this.children.forEach((child) => child.render());
    interval = setInterval(this.handleStartRace.bind(this), 1000);
  }

  handleStartRace() {
    if (this.state.count === this.props.time) {
      clearInterval(interval);
      this.handlers.onGetResult(this.state.carInfos);
      return;
    }
    const isArrived = this.state.count + 1 === this.props.time;
    this.children.forEach((child) => child.handleRace(isArrived));
    this.state = { ...this.state, count: this.state.count + 1 };
  }

  handleArrive(name, step) {
    this.state = {
      ...this.state,
      carInfos: [...this.state.carInfos, { name, step }],
    };
  }
}

export default CarRace;
