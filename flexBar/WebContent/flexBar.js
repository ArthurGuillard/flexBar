/**
 * 	flexBar JQuery plugin by Arthur Guillard
 *  using : -bootstrap
 *  		-JQuery
 */
(function($) {
	var instances = [];

	function FlexBar(methodOrOptions) {
		this._hiddenMethods = {
	        init 		: _init,
	        show 		: _show,
	        hide 		: _hide,
	        onShow		: _onShow,
	        onHide		: _onHide,
	        onChange	: _onChange
		};

	    this._properties = {
	        initialized 	: false,
	        data			: null
	    };

	    this._defaults = {
			position	: 'top',
			onShow		: undefined,
			onHide		: undefined,
			onChange	: undefined
	    };
	    
	    function _init(options) {
	    	this._defaults = $.extend(
	    			{},
	    			this._defaults,
	    			options
	    	);
	    	$(this).on("flexbar-show", this._onShow);
	    	$(this).on("flexbar-hide",this._onHide);
	    	$(this).on("flexbar-change", this._onChange);
	    	this._properties.initialized = true;
	    	return $(this);
	    };

	    function _show(data) {
	    	$(this).trigger('flexbar-show', new Event(	$(this),
	    											  	'onShow',
	    											  	data));
	    	return $(this);
	    };

	    function _hide(data) {
	    	$(this).trigger('flexbar-hide', new Event(	$(this),
					  									'onHide',
					  									data));
	    	return $(this);
	    };
	    
	    function _onShow(data) {
	    	if (typeof defaults['onShow'] === 'function')
	    		this._defaults['onShow'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	return defaults['onShow'];
	    };

	    function _onHide(data) {
	    	if (typeof defaults['onHide'] === 'function')
	    		this._defaults['onHide'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	return defaults['onHide'];
	    };

	    function _onChange(data) {
	    	if (typeof defaults['onChange'] === 'function')
	    		this._defaults['onChange'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	console.log('>ONHIDE event...');
	    	return $(this);
	    };
	}

    $.fn.flexBar = function(methodOrOptions) {
    	$el = $(this);
    	console.log($el);

//    	if (properties.initialized) {
//        	if (hiddenMethods[methodOrOptions]) {
//        		if (!isEvent(methodOrOptions))
//        			return hiddenMethods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
//            } else if (methodOrOptions in defaults) {
//            	if (typeof defaults[methodOrOptions] === 'function')
//            		return defaults[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
//            	else
//            		return defaults[methodOrOptions];
//            } else {
//            	$.error('Unknown method \'' +  methodOrOptions + '\' in $.flexBar');
//            }
//    	} else if (!properties.initialized &&
//    			   (typeof methodOrOptions === 'object' || !methodOrOptions)) {
//    		return hiddenMethods.init.apply(this, arguments);
//        } else {
//            $.error('$.flexBar does not know method \'' + methodOrOptions + '\'... Did you initialize it?' );
//        }
    };

    /**
     * Events management
     */
    function Event(object, name, data) {
    	this.object = object;
    	this.name = name;
    	this.data = data;
    }

    /**
     * FlexBar Buttons
     */
    function FlexBarButton(label, callback, id, cssClass) {
    	this.label = label;
    	if (!label)
    		$.warn("No label provided for FlexBarButton" + (id ? (" '" + id + "'") : "..."));
    	this.callback = callback;
    	if (!callback)
    		$.warn("No callback function provided for FlexBarButton" + (id ? (" '" + id + "'") : "..."));
    	this.id = id;
    	if (!id && callback)
    		$.error("No id provided for FlexBarButton but a callback function was... Callback can't be set without an id!");
    	this.cssClass = cssClass;
    }

    FlexBarButton.prototype.getButtonAsHtml = function() {
    	var htmlButton = "<button type='button'";
    	if (this.id)
    		htmlButton += " id='" + this.id + "'";
    	if (this.cssClass)
    		htmlButton += " class='" + this.cssClass + "'";
    	htmlButton += ">";
    	if (this.label)
    		htmlButton += this.label;
    	htmlButton += "</button>";
    	return htmlButton;
    }
    
    /**
     * Utilities function
     */
    function isEvent(eventName) {
    	return 	eventName == 'flexbar-show' ||
    			eventName == 'flexbar-hide' ||
    			eventName == 'change';
    }
})(jQuery);