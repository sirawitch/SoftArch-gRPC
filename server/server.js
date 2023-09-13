const PROTO_PATH="./restaurant.proto";
const connectDB = require('../config/db')
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
connectDB();
const Menu = require('../models/Menu')
var packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var restaurantProto =grpc.loadPackageDefinition(packageDefinition);

const {v4: uuidv4}=require("uuid");

const server = new grpc.Server();
const menu=[
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "Tomyam Gung",
        price: 500
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Somtam",
        price: 60
    },
    {
        id: "8551887c-f82d-4e44-88ca-ae2a1ccc92b7",
        name: "Pad-Thai",
        price: 120
    }
];
server.addService(restaurantProto.RestaurantService.service,{
    getAllMenu:async (_,callback)=>{
        try {
        const menuItems = await Menu.find({});
        callback(null, { menu: menuItems });
      } catch (err) {
        callback(err);
      }
    },
    get: async (call, callback) => {
      try {
        const menuItem = await Menu.findOne({ id: call.request.id }); // Use 'id' field
        if (menuItem) {
          callback(null, menuItem);
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found",
          });
        }
      } catch (err) {
        callback(err);
      }
    },
    insert: async (call, callback) => {
      const menuItem = new Menu(call.request);
      menuItem.id = uuidv4();

      try {
        const savedMenuItem = await menuItem.save();
        callback(null, savedMenuItem);
      } catch (err) {
        callback(err);
      }
    },
    update: async (call, callback) => {
      try {
        const updatedMenuItem = await Menu.findOneAndUpdate(
          { id: call.request.id }, // Use 'id' field for query
          call.request,
          { new: true }
        );
        if (updatedMenuItem) {
          callback(null, updatedMenuItem);
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found",
          });
        }
      } catch (err) {
        callback(err);
      }
    },
    remove: async (call, callback) => {
      try {
        const result = await Menu.findOneAndDelete({ id: call.request.id }); // Use 'id' field for query
        if (result) {
          callback(null, {});
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found",
          });
        }
      } catch (err) {
        callback(err);
      }
    },
  });
server.bindAsync("127.0.0.1:30043",grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
console.log("Server running at http://127.0.0.1:30043");