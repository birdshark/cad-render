import Start from '../../views/start/index.jsx'
import Install from '../../views/start/install.jsx'
import Introduction from "../../views/start/introduction.jsx"
module.exports = {
    path:'start',
    component:Start,
    childRoutes:[
    	{
    		path:'introduction',
    		component:Introduction
    	},
    	{
    		path:'install',
    		component:Install
    	},
    	{
    		path:'agreen',
    		component:require("../../views/start/agreen")
    	},
        {
            path:"basic-shapes",
            component:require("../../views/start/basic-shapes")
        },
        {
        	path:"inside-shapes",
            component:require("../../views/start/inside-shapes")
        }
    ]
}