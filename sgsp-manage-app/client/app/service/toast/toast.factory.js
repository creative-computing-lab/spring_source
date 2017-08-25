var ToastFactory = function (ngToast) {
  var createToast = function(className, msg) {
    ngToast.create({
      className : className,
      content : msg
    })
  }
	var success = function(msg) {
	  createToast('success', msg);
	}
	var info = function(msg) {
  	createToast('info', msg);
  }
	var error = function(msg) {
  	createToast('danger', msg);
  }
	var warning = function(msg) {
    createToast('warning', msg);
  }
  return { success:success, info:info, error:error, warning:warning };
};

module.exports = ToastFactory;
