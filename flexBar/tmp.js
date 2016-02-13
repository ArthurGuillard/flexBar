/**
 *	Usage
 *	When you want to use the fixedBtnBar, you need to initialize it first
 *	by calling init() method with :
 *		- An array of FixedBtnBarButton Objects
 *		  Then call show/hide directly.
 *		- Without parameter
 *		  Then you have to call add() passing a FixedBtnBarButton
 *		  Then you can use show()/hide()
 *
 *	FixexBtnBarButton needs a callback and a label.
 *	callback and id are not mandatory event though it won't make sense
 *	not to give a callback function to a button...
*/
function FixedBtnBarButton(label, callback, id, cssClass) {
	this.label = label;
	if (!label)
		console.warn("Warning : no label provided for fixedBtnBarButton" + (id ? (" '" + id + "'") : "..."));
	this.callback = callback;
	if (!callback)
		console.warn("Warning : no callback function provided for fixedBtnBarButton" + (id ? (" '" + id + "'") : "..."));
	this.id = id;
	if (!id && callback)
		console.error("Error : no id provided for fixedBtnBarButton but a callback function was... Callback can't be set without an id!");
	this.cssClass = cssClass;
}

FixedBtnBarButton.prototype.getButtonAsHtml = function() {
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

var fixedBtnBar = {
	domElement : null,
	initialPosition : 0,
	isOffScroll : false,
	offScrollChanged : false,
	buttonsData : [],
	isInitialized : false,
	isShown : false,
	init : function(buttonsData) {
		if ($('#fixedBtnBarContainer').length) {
			$('#fixedBtnBarContainer').append('<div id="fixedBtnBar"><div id="fixedBtnBarButtonContainer" class="fixed-btnbar-center-buttons"></div></div>');
			fixedBtnBar.domElement = $('#fixedBtnBarButtonContainer');
			fixedBtnBar.initialPosition = fixedBtnBar.domElement.offset().top;
			if (buttonsData) {
				fixedBtnBar.buttonsData = buttonsData;
				$.each(fixedBtnBar.buttonsData, function(index, value) {
					fixedBtnBar.domElement.append(value.getButtonAsHtml());
				});
				fixedBtnBar.bindCallbacks();
			}
			fixedBtnBar.isInitialized = true;
			fixedBtnBar.isShown = false;
		}
		else
			console.error('Error : no <div> with id "fixedBtnBarContainer" found in DOM but trying to use fixedBtnBar.init');
	},
	show : function() {
		if (fixedBtnBar.buttonsData && fixedBtnBar.isInitialized) {
			if (($(window).scrollTop() - fixedBtnBar.initialPosition) > 0) {
				fixedBtnBar.domElement.addClass("fixed-btnbar-button-container");
				fixedBtnBar.domElement.parent().addClass("fixed-btnbar");
				fixedBtnBar.isOffScroll = true;
			} else {
				fixedBtnBar.domElement.removeClass("fixed-btnbar-button-container");
				fixedBtnBar.domElement.parent().removeClass("fixed-btnbar");
				fixedBtnBar.isOffScroll = false;
			}
			fixedBtnBar.domElement.show();
			fixedBtnBar.isShown = true;
			$(window).scroll(function() {
				if (($(window).scrollTop() - fixedBtnBar.initialPosition) > 0) {
					if (!fixedBtnBar.isOffScroll)
						fixedBtnBar.offScrollChanged = true;
					fixedBtnBar.isOffScroll = true;
			    }
			    else {
			    	if (fixedBtnBar.isOffScroll)
			    		fixedBtnBar.offScrollChanged = true;
			    	fixedBtnBar.isOffScroll = false;
			    }

				// Adding or removing only if necessary (offScrollChanged = true)
				if (fixedBtnBar.offScrollChanged) {
					if (fixedBtnBar.isOffScroll) {
						fixedBtnBar.domElement.addClass("fixed-btnbar-button-container");
						fixedBtnBar.domElement.parent().addClass("fixed-btnbar");
					}
					else {
						fixedBtnBar.domElement.removeClass("fixed-btnbar-button-container");
						fixedBtnBar.domElement.parent().removeClass("fixed-btnbar");
					}
					fixedBtnBar.offScrollChanged = false;
				}
			});
		} else
			console.warn("Warning : no buttons in fixedButtonBar but calling fixedButtonBar.show. Nothing to show...");
	},
	hide : function() {
		if (fixedBtnBar.buttonsData && fixedBtnBar.isInitialized) {
			fixedBtnBar.domElement.hide();
			$(window).unbind('scroll');
			fixedBtnBar.isShown = false;
		} else
			console.warn("Warning : no buttons in fixedButtonBar but calling fixedButtonBar.hide. Nothing to hide...");
	},
	bindCallbacks : function() {
		if (fixedBtnBar.buttonsData && fixedBtnBar.isInitialized) {
			$.each(fixedBtnBar.buttonsData, function(index, value) {
				$('#' + value.id).click(value.callback);
			});
		} else
			console.warn("Warning : no buttons in fixedButtonBar but calling fixedButtonBar.bindCallbacks...");
	},
	unbindCallbacks : function() {
		if (fixedBtnBar.buttonsData && fixedBtnBar.isInitialized) {
			$.each(fixedBtnBar.buttonsData, function(index, value) {
				$('#' + value.id).unbind('click');
			});
		} else
			console.warn("Warning : no buttons in fixedButtonBar but calling fixedButtonBar.unbindCallbacks...");
	},
	add : function(fixedBtnBarButton) {
		if (fixedBtnBar.isInitialized) {
				fixedBtnBar.buttonsData.push(fixedBtnBarButton);
				fixedBtnBar.domElement.append(fixedBtnBarButton.getButtonAsHtml());
				if (fixedBtnBarButton.callback)
					$('#' + fixedBtnBarButton.id).click(fixedBtnBarButton.callback);
				if (!fixedBtnBar.isShown)
					fixedBtnBar.hide();
		} else
			console.error("Error : can't add fixedBtnBarButton. fixedBarBtn is not initialized...");
	},
	remove : function (fixedBtnBarButtonId) {
		if (fixedBtnBar.buttonsData && fixedBtnBar.isInitialized) {
			$.each(fixedBtnBar.buttonsData, function(index, value) {
				if (value.id == fixedBtnBarButtonId) {
					var buttonDomElement = $('#' + value.id);
					buttonDomElement.unbind('click');
					buttonDomElement.remove();
					fixedBtnBar.buttonsData.splice(index, 1);
					return false;
				}
			});
		}
	},
	toggle : function () {
		if (fixedBtnBar.isShown)
			fixedBtnBar.hide();
		else
			fixedBtnBar.show();
	}
};