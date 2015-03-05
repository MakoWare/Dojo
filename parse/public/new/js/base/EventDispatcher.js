/**
* Event dispatcher class,
* add ability to dispatch event
* on native classes.
*
* Use of Class.js
*
* @author universalmind.com
*/
var EventDispatcher = Class.extend({
    _listeners:{},

    /**
    * Add a listener on the object
    * @param type : Event type
    * @param listener : Listener callback
    */
    addEventListener:function(type,listener){
        if(!this._listeners[type]){
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    },


    /**
       * Remove a listener on the object
       * @param type : Event type
       * @param listener : Listener callback
       */
    removeEventListener:function(type,listener){
        console.log("removeEventListener()");
        console.log(type);
        console.log(listener);
        console.log(this._listeners);
      if(this._listeners[type]){
          console.log("found listener of type");
          console.log(this._listeners[type]);
          var index = this._listeners[type].indexOf(listener);


        if(index!==-1){
            this._listeners[type].splice(index,1);
            console.log("removed a listener");
        }
      }
        console.log(this._listeners);
    },


    /**
    * Dispatch an event to all registered listener
    * @param Mutiple params available, first must be string
    */
    dispatchEvent:function(){
        var listeners;

        if(typeof arguments[0] !== 'string'){

        }else{
            listeners = this._listeners[arguments[0]];

            for(var key in listeners){
                //This could use .apply(arguments) instead, but there is currently a bug with it.
                listeners[key](arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);
            }
        }
    }
});
