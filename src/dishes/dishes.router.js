const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
router.route("/")
  .get(controller.list)
  .post(
    controller.validName,
    controller.validDescription,
    controller.validImageURL,
    controller.validPrice,
    controller.create
  )
  .all(methodNotAllowed);

router.route("/:dishId")
  .get(
    controller.validDishId,
    controller.read
  )
  .put(
    controller.validDishId,
    controller.validName,
    controller.validDescription,
    controller.validImageURL,
    controller.validPrice,
    controller.update
  )
  .delete(
    controller.destroy
  )
  .all(methodNotAllowed);

module.exports = router;
