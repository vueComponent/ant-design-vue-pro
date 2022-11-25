# fmin [![Build Status](https://travis-ci.org/benfred/fmin.svg?branch=master)](https://travis-ci.org/benfred/fmin)

Unconstrained function minimization in javascript.

This package implements some basic numerical optimization algorithms: Nelder-Mead, Gradient
Descent, Wolf Line Search and Non-Linear Conjugate Gradient methods are all provided.

Interactive visualizations with D3 explaining how these algorithms work are also included in this package.
Descriptions of the algorithms as well as most of the visualizations are available on my blog post
[An Interactive Tutorial on Numerical
Optimization](http://www.benfrederickson.com/numerical-optimization/).

## Installing

If you use NPM, `npm install fmin`. Otherwise, download the [latest release](https://github.com/benfred/fmin/releases/latest).

## API Reference

<a href="#nelderMead" name="nelderMead">#</a> <b>nelderMead</b>(<i>f</i>, <i>initial</i>)

Uses the [Nelder-Mead method](https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method) to
minimize a function <i>f</i> starting at location <i>initial</i>.

Example usage  minimizing the function <i>f(x, y) = x<sup>2</sup> + y<sup>2</sup> + x sin y + y
sin x</i> is:
![nelder mead demo](./images/nelder_mead.gif)

```js
function loss(X) {
    var x = X[0], y = X[1];
    return Math.sin(y) * x  + Math.sin(x) * y  +  x * x +  y *y;
}

var solution = fmin.nelderMead(loss, [-3.5, 3.5]);
console.log("solution is at " + solution.x);
```

<!--
<a href="#gradientDescent" name="gradientDescent">#</a> <b>gradientDescent</b>()

[![gradient descent demo](./images/gradient_descent.gif)](./examples/gradient_descent.html)
-->

<a href="#conjugateGradient" name="conjugateGradient">#</a> <b>conjugateGradient</b>(<i>f</i>, <i>initial</i>)

Minimizes a function using the [Polak–Ribière non-linear conjugate gradient method
](https://en.wikipedia.org/wiki/Nonlinear_conjugate_gradient_method). The function <i>f</i> should
compute both the loss and the gradient.

An example minimizing [Rosenbrock's Banana
function](https://en.wikipedia.org/wiki/Rosenbrock_function) is:

![conjugate gradient demo](./images/conjugate_gradient.gif)

```js
function banana(X, fxprime) {
    fxprime = fxprime || [0, 0];
    var x = X[0], y = X[1];
    fxprime[0] = 400 * x * x * x - 400 * y * x + 2 * x - 2;
    fxprime[1] = 200 * y - 200 * x * x;
    return (1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x);
}

var solution = fmin.conjugateGradient(banana, [-1, 1]);
console.log("solution is at " + solution.x);
```
