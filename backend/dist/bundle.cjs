/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stripe */ \"stripe\");\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(stripe__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_3__);\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_3___default().config();\nconst PORT = process.env.PORT || 5000;\nconst app = express__WEBPACK_IMPORTED_MODULE_0___default()();\nconst stripe = new (stripe__WEBPACK_IMPORTED_MODULE_1___default())(process.env.STRIPE_SECRET_KEY);\napp.use(express__WEBPACK_IMPORTED_MODULE_0___default().json());\napp.use(cors__WEBPACK_IMPORTED_MODULE_2___default()({ origin: \"http://localhost:3000\" }));\napp.post(\"/create-payment-intent\", (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const { paymentMethodId, amount } = req.body;\n    console.log(paymentMethodId, amount);\n    try {\n        const paymentIntent = yield stripe.paymentIntents.create({\n            amount,\n            currency: \"usd\",\n        });\n        res.send({\n            clientSecret: paymentIntent.client_secret,\n        });\n    }\n    catch (error) {\n        if (typeof error === \"object\" && error !== null && \"message\" in error) {\n            res.status(500).send({ error: error.message });\n        }\n    }\n}));\napp.post(\"/create-setup-intent\", (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const { email } = req.body;\n    try {\n        // Проверьте, существует ли клиент с таким email\n        let customer = (yield stripe.customers.list({ email })).data[0];\n        // Если клиента нет, создайте его\n        if (!customer) {\n            customer = yield stripe.customers.create({ email });\n        }\n        // Создайте SetupIntent для клиента\n        const setupIntent = yield stripe.setupIntents.create({\n            customer: customer.id,\n        });\n        res.send({\n            clientSecret: setupIntent.client_secret,\n            customerId: customer.id,\n        });\n    }\n    catch (error) {\n        res.status(500).send({ error: error.message });\n    }\n}));\napp.post(\"/save-payment-method\", (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const { customerId, paymentMethodId } = req.body;\n    try {\n        // Привязка метода оплаты к клиенту\n        yield stripe.paymentMethods.attach(paymentMethodId, {\n            customer: customerId,\n        });\n        // Установите метод оплаты по умолчанию\n        yield stripe.customers.update(customerId, {\n            invoice_settings: {\n                default_payment_method: paymentMethodId,\n            },\n        });\n        res.send({ success: true });\n    }\n    catch (error) {\n        res.status(500).send({ error: error.message });\n    }\n}));\napp.post(\"/create-payment-intent\", (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const { email, amount } = req.body;\n    try {\n        // Найдите клиента по email\n        const customers = yield stripe.customers.list({ email });\n        const customer = customers.data[0];\n        if (!customer) {\n            throw new Error(\"Customer not found\");\n        }\n        // Получите связанные методы оплаты\n        const paymentMethods = yield stripe.paymentMethods.list({\n            customer: customer.id,\n            type: \"card\",\n        });\n        const paymentMethodId = paymentMethods.data[0].id;\n        // Создайте PaymentIntent и подтвердите его\n        const paymentIntent = yield stripe.paymentIntents.create({\n            amount,\n            currency: \"usd\",\n            customer: customer.id,\n            payment_method: paymentMethodId,\n            off_session: true,\n            confirm: true,\n        });\n        res.send({ success: true, paymentIntent });\n    }\n    catch (error) {\n        res.status(500).send({ error: error.message });\n    }\n}));\napp.listen(PORT, () => console.log(`Server is running on port ${PORT}`));\n\n\n//# sourceURL=webpack://backend/./src/index.ts?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "stripe":
/*!*************************!*\
  !*** external "stripe" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stripe");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;