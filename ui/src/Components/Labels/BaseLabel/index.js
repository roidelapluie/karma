import { Component } from "react";
import PropTypes from "prop-types";

import { AlertStore } from "Stores/AlertStore";
import { GetLabelColorClass, StaticColorLabelClass } from "Common/Colors";
import { QueryOperators, FormatQuery } from "Common/Query";

import "./index.css";

// base class for shared code, not used directly
class BaseLabel extends Component {
  static propTypes = {
    alertStore: PropTypes.instanceOf(AlertStore).isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  };

  isStaticColorLabel(name) {
    const { alertStore } = this.props;

    return alertStore.settings.values.staticColorLabels.includes(name);
  }

  getColorClass(name, value) {
    if (this.isStaticColorLabel(name)) {
      return StaticColorLabelClass;
    }
    return GetLabelColorClass(name, value);
  }

  getColorStyle(name, value) {
    const { alertStore } = this.props;

    let style = {};

    if (this.isStaticColorLabel(name)) {
      // static labels only get class, no unique colors
      return style;
    }

    if (
      alertStore.data.colors[name] !== undefined &&
      alertStore.data.colors[name][value] !== undefined
    ) {
      const c = alertStore.data.colors[name][value];
      style["backgroundColor"] = `rgba(${[
        c.background.red,
        c.background.green,
        c.background.blue,
        c.background.alpha
      ].join(", ")})`;
      style["color"] = `rgba(${[
        c.font.red,
        c.font.green,
        c.font.blue,
        c.font.alpha
      ].join(", ")})`;
    }
    return style;
  }

  handleClick = event => {
    event.preventDefault();

    const { name, value, alertStore } = this.props;
    alertStore.filters.addFilter(
      FormatQuery(name, QueryOperators.Equal, value)
    );
  };
}

export { BaseLabel };
