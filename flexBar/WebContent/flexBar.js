/**
 * 	flexBar JQuery plugin by Arthur Guillard
 *  using : -bootstrap
 *  		-JQuery
 */
(function($) {
	var instancesId = [];

	function FlexBar($el, options) {
    	this._hiddenMethods = {
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
	    	return this._defaults['onShow'];
	    };

	    function _onHide(data) {
	    	if (typeof defaults['onHide'] === 'function')
	    		this._defaults['onHide'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	return this._defaults['onHide'];
	    };

	    function _onChange(data) {
	    	if (typeof defaults['onChange'] === 'function')
	    		this._defaults['onChange'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	console.log('>ONHIDE event...');
	    	return this._defaults['onChange'];
	    };
	    
	    this._defaults = $.extend(
    			{},
    			this._defaults,
    			options
    	);

	    $el.on("flexbar-show", this._onShow);
    	$el.on("flexbar-hide",this._onHide);
    	$el.on("flexbar-change", this._onChange);

    	this._properties.initialized = true;
	    return this;
	}
	
	FlexBar.prototype.getMethods = function() {
		return this._hiddenMethods;
	}

	$.fn.flexBar = function(methodOrOptions) {
    	$el = $(this);
    	var elementId = $el.prop('id');
    	if (elementId) {
    		// Already instanciated
	    	if ($.inArray(elementId, instancesId) > -1) {
	    		var flexBar = $el.data('flexBar');

	    		// Still passing arguments array or nothing;
	    		if (typeof methodOrOptions === 'object' || !methodOrOptions) {
		    		// TODO think maybe return flexBar instance instead of error ?
	    			$.error('$.flexBar is already initialized on \'' + elementId + "\'.");
	    		} else {
	            	if (flexBar._hiddenMethods[methodOrOptions]) {
	            		if (!isEvent(methodOrOptions))
	            			return flexBar._hiddenMethods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
	                } else if (methodOrOptions in flexBar._defaults) {
	                	if (typeof flexBar._defaults[methodOrOptions] === 'function')
	                		return flexBar._defaults[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
	                	else
	                		return flexBar._defaults[methodOrOptions];
	                } else {
	                	$.error('Unknown method \'' +  methodOrOptions + '\' in $.flexBar');
	                }
	    		}
	    	} else {
	    		// TODO : check if no problem when el is removed from the dom
	    		// since there si no splice or remove in the instancesId array...
	    		instancesId.push(elementId);
	    		var options = (typeof methodOrOptions === 'object') ? methodOrOptions : undefined;
	    		var flexBarData = new FlexBar($el, options);

	    		console.log('>pushed: ' + $el.prop('id'));
	    		$el.data('flexBar', flexBarData);
	    		return $el;
	    	}
    	} else
    		$.error('$.flexBar elements must have an id.');
    };
	
    /**
     * Event utils
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