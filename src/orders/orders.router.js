const router = require("express").Router();
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass
router.route("/")
    .get(controller.list)
    .post(
        controller.validDeliverTo,
        controller.validMobile,
        controller.validDishesProp,
        controller.validDishQuantity,
        controller.create
    )
    .all(methodNotAllowed);

router.route("/:orderId")
    .get(
        controller.validOrderId,
        controller.read
        )
    .put(
        controller.validDeliverTo,
        controller.validOrderId,
        controller.validMobile,
        controller.validDishesProp,
        controller.validDishQuantity,
        controller.validStatus,
        controller.update
    )
    .delete(
        controller.validOrderId,
        controller.destroy
    )
    .all(methodNotAllowed);

module.exports = router;
