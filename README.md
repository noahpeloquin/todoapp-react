# todoapp-react
For this task, keep it simple but make it look good.

This just needs to be an extremely basic todo list app where a user can log in and (add edit and delete) todolist items. It doesn't need to be more complex than that.

This is the ReactJS web app for talking to the REST to-do-app backends.
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find a create-react-app guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

Compatible Backends:

* [NodeJS + REST](https://github.com/chiedolabs/blog-app.node)

## Deployment

The server will need to run the build command in order to inject it's environment variables. The create-react-app approach will prevent us building the environment locally. In theory, you could update the build script in package.json and prepend it with data like REACT_APP_API_URL=www.something.com and that would allow you to build locally..
