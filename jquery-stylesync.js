(function ( $ ) {
   
   var Data = {
      set: function set(key, value) {
         $.data(document.body, key, value);
      },
      
      get: function get(key, value) {
         return $.data(document.body, key);
      }
   };
   
   function _startSync () {
      Data.set("startSync", true);
      
      setInterval(function syncInterval() {
         var obj = Data.get("syncedObjects");
         if (!obj) return;
         
         $.each(obj, function syncSync(key, pair) {
            var dest = pair[0];
            var target = pair[1];
            var styles = pair[2];
            
            if ($.type(styles) != "array") throw "_startSync::syncSync - styles invalid: " + styles;
            
            $.each(styles, function syncSyncStyles(key, style){
               var destStyle = dest.css(style);
               var targetStyle = target.css(style);
               
               if (destStyle && destStyle !== targetStyle) {
                  target.css(style, destStyle);
               }
            });
         });
      }, 250);
   }

   function _simpleSync (object, target, styles) {
      if ($.type(object) != "object" || $.type(target) != "object" || $.type(styles) != "array") {
         throw "_simpleSync - parameters invalid: " + object + ", " + target + ", " + style;
      }
   
      var syncedObjects = Data.get("syncedObjects") || [];
      var tmp = [object, target, styles];
      syncedObjects.push(tmp);
      Data.set("syncedObjects", syncedObjects);
      
      if (Data.get("syncedObjects") && !Data.get("startSync")) {
         _startSync();
      }
   }

   $.fn.styleSync = function styleSync(obj, styles) {
      if (!obj) throw "jQuery::styleSync - no target";
   
      if ($.type(obj) == "string") {
         obj = $(obj);
      }
      else if ($.type(obj) == "array") {
         var self = this;
         $.each(obj, function(value) {
            _simpleSync(self, value, styles); 
         });
      }
      else if ($.type(obj) == "object") {
         _simpleSync(this, obj, styles);
      }
   };

}) (jQuery);