const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function getDishes(req, res){
  res.json({data: dishes});
}

// req checking middleware
function validDeliverTo(req, res, next){
  const {data: {deliverTo}} = req.body;

  if (deliverTo){
    res.locals = {...res.locals, deliverTo: deliverTo};
    next();
  }else{
    next({
      status: 400,
      message: "Order must include a deliverTo"
    })
  }
}

function validMobile(req, res, next){
  const {data: { mobileNumber } = {}} = req.body;
  const {data} = req.body;

  if (mobileNumber){
    res.locals = {...res.locals, mobileNumber: mobileNumber};
    next();
  }else{
    next({
      status: 400,
      message: "Order must include a mobileNumber"
    })
  }
}

function validDishesProp(req, res, next){
  const { data: {dishes} = {}} = req.body;
  if(!dishes){
    next({
      status: 400,
      message: "Order must include a dish"
    });
  }else if (Array.isArray(dishes) && dishes.length > 0){
    res.locals = {...res.locals, dishes: dishes};
    next();
  }else{
    next({
      status: 400,
      message: `Order must include at least one dish.`
    });
  }
}

function validOrderId(req, res, next){
  const {orderId} = req.params;
  const {data: {id} = {}} = req.body;

  
  const order = orders.find(order => order.id == orderId);
  if (order){
    if (id && orderId !== id) next({status: 400, message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`});
    res.locals = {...res.locals, order: order};
    next();
  }else{
    next({
      status: 404,
      message: `Order ${orderId} does not exist`
    })
  }
  
}

function validDishQuantity(req, res, next){
  const dishes = res.locals.dishes;

  const error = dishes.find((dish, index) => {
    dish.quantity < 1 || !dish.quantity || !Number.isInteger(dish.quantity) ? 
      next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`
      }) : "";
  });

  next();
}

function validStatus(req, res, next){
  const {data: {status} = {}} = req.body;

  if (!status || status === "invalid"){
    next({
      status: 400,
      message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
    })
  }else if(status === "delivered"){
    next({
      status: 400,
      message: "A delivered order cannot be changed"
    })
  }

  next();
}


// routing

function list(req, res){
  res.json({data: orders});
}

function create(req, res){
  const id = nextId();
  const order = {
    id: id,
    deliverTo: res.locals.deliverTo,
    mobileNumber: res.locals.mobileNumber,
    status: "pending",
    dishes: res.locals.dishes
  };

  orders.push(order);
  res.status(201).json({data: order});
}

function read(req, res){
  res.json({data: res.locals.order});
}

function update(req, res){
  const order = res.locals.order;
  const {orderId} = req.params;

  if (order.id !== orderId) next({status: 400, message: `Order id does not match route id. Order: ${order.id}, Route: ${orderId}.`})

  if (res.locals.deliverTo){
    order.deliverTo = res.locals.deliverTo;
  }
  if (res.locals.description){
    order.mobileNumber = res.locals.mobileNumber;
  }
  if (res.locals.image_url){
    order.dishes = res.locals.dishes;
  }

  res.json({data: order});
}

function destroy(req, res){
  const orderToDel = res.locals.order;

  if (orderToDel.status !== 'pending') res.status(400).json({error: "	Order must have a status of pending, preparing, out-for-delivery, delivered"})

  const indexToDel = orders.indexOf(orderToDel);

  orders.splice(indexToDel, 1);
  res.status(204).json({"error": "deleted"});
}


module.exports = {
  list,
  create,
  read,
  update,
  destroy,

  // data checks
  validDeliverTo,
  validMobile,
  validDishesProp,
  validOrderId,
  validDishQuantity,
  validStatus
}