const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware validity checks
function validName(req, res, next){
  const { data: { name } = {} } = req.body;
  if (!name){
    next({
      status: 400,
      message: "Dish must include a name"
    });
  }else{
    res.locals = {...res.locals, name: name};
    next();
  }
}

function validDescription(req, res, next){
  const { data: { description } = {} } = req.body;
  if (!description){
    next({
      status: 400,
      message: "Dish must include a description"
    });
  }else{
    res.locals = {...res.locals, description: description};
    next();
  }
}

function validImageURL(req, res, next){
  const { data: {image_url} = {}} = req.body;
  if (!image_url){
    next({
      status: 400,
      message: "Dish must include a image_url"
    });
  }else{
    res.locals = {...res.locals, image_url : image_url};
    next();
  }
}

function validPrice(req, res, next){
  const { data: { price } = {}} = req.body;
  if (!price){
    next({
      status: 400,
      message: "Dish must include a price"
    });
  }else if (!Number.isInteger(price) || price < 0){
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0"
    });
  }else{
    res.locals = {...res.locals, price: price};
    next();
  }
}

function validDishId(req, res, next){
  const { dishId } = req.params;
  const { data: { id } = {}} = req.body;
  const dish = dishes.find(dish => dish.id === dishId);
  
  if (!dish){
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}`
    });
  }else if (id && id !== dishId){
    next({
      status: 400,
      message: `Dish id does not match route id. Dish ${id}, Route: ${dishId}`
    })
  }else{
    res.locals = {...res.locals, dish: dish };
    next();
  }
}


// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res){
  res.json({data: dishes});
}

function create(req, res){
  const id = nextId();
  const dish = {
    id: id,
    name: res.locals.name,
    description: res.locals.description,
    price: res.locals.price,
    image_url: res.locals.image_url
  };
  
  dishes.push(dish);
  res.status(201).json({data: dish});
}

function read(req, res){
  res.json({data : res.locals.dish});
}

function update(req, res){
  const dish = res.locals.dish;

  if (res.locals.name){
    dish.name = res.locals.name;
  }
  if (res.locals.description){
    dish.description = res.locals.description;
  }
  if (res.locals.image_url){
    dish.image_url = res.locals.image_url;
  }
  if (res.locals.price){
    dish.price = res.locals.price;
  }

  res.status(200).json({data: dish});
}

function destroy(req, res){

  res.status(405).json({error: "deleted"});
}


module.exports = {
  list,
  create,
  read,
  update,
  destroy,
  
  // middleware exports
  validName,
  validDescription,
  validImageURL,
  validPrice,
  validDishId,
}