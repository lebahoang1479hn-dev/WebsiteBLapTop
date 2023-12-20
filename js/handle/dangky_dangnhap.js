function Validator(options) {

    function getParent(element, selector){ //element <=> inputElement
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement; 
        }
    }

    var selectorRules = {}; //dùng để lưu tất cả các rules của selector của ta vào đây

    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector); //Lấy ra đc error message
        // var errorMessage = rule.test(inputElement.value); //dùng để chạy hàm test & phải truyền giá trị mà ng dùng nhập vào là inputElement.value
        var errorMessage;
        // console.log(errorMessage);

        //Lấy qua các rules của selector
        var rules = selectorRules[rule.selector]; //nhận lại đc các rules của inputElement khi blur ra ngoài
        // console.log(rules);

        //Lặp qua từng rule & kiểm tra
        //Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value); //vì rules là mảng nên lặp qua
            }
            if (errorMessage) {
                break;
            }
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage; //In ra message lỗi
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }
        else {
            errorElement.innerText = ''; //Khi không có lỗi thì là chuỗi rỗng
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage; //Thêm dấu not để thành boolean
    }

    //Lấy ra đối tượng form cần validate
    var formElement = document.querySelector(options.form);

    if (formElement) {

        //Khi bấm submit form thì bỏ đi hành vi mặc định
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true; //đặt biến flag

            //Lặp qua từng rules & validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            //Khi form ko có lỗi
            if (isFormValid) {
                //Trường hợp submit với JS
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]'); //Lấy ra các input ở trạng thái enable
                    // console.log(enableInputs);

                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        switch(input.type){
                            case 'radio':
                                if(input.matches(':checked')){
                                    values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                }
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    values[input.name] = [];
                                    return values;
                                }

                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value);
                                break;

                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values; //gán input value cho object value & cuối cùng trả về value của ta
                    }, {});
                    options.onSubmit(formValues);
                }

                //Trường hợp submit với hành vi mặc định
                else{
                    formElement.submit();
                }
            }
        }

        // console.log(options.rules) //đây là 1 mảng gồm 2 phần tử
        options.rules.forEach(function (rule) { //duyệt qua 1 array và nhận lại đc từng rule đã cấu hình ở bên ngoài
            // console.log(rule); //in ra 2 cái rule return ở 2 func isRequired & isEmail
            // console.log(rule.selector); //Lấy ra #fullname & #email

            //Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test); //Nếu nó là mảng(từ 2 rules trở lên) thì nó sẽ lưu lại các rule đó
            }
            else {
                selectorRules[rule.selector] = [rule.test]; //Nếu selectorRules ko phải là mảng(khi chạy lần đầu tiên thì nó sẽ gán = rule đầu tiên)
            }

            // var inputElement = formElement.querySelector(rule.selector);
            var inputElements = formElement.querySelectorAll(rule.selector); //Lấy ra đối tượng input(inputElement)
            // console.log(inputElement);

            Array.from(inputElements).forEach(function(inputElement){
                //Xử lý khi blur ra ngoài inputElement
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                //Xử lý mỗi khi ng dùng nhập vào input
                inputElement.oninput = function () {
                    //Khi ng dùng bắt đầu gõ thì bỏ đi message lỗi
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = ''; //Khi không có lỗi thì là chuỗi rỗng
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }


            });

            // if (inputElement) {
            //     //Xử lý khi blur ra ngoài inputElement
            //     inputElement.onblur = function () {
            //         validate(inputElement, rule);
            //     }

            //     //Xử lý mỗi khi ng dùng nhập vào input
            //     inputElement.oninput = function () {
            //         //Khi ng dùng bắt đầu gõ thì bỏ đi message lỗi
            //         var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
            //         errorElement.innerText = ''; //Khi không có lỗi thì là chuỗi rỗng
            //         getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
            //     }
            // }
        });

        // console.log(selectorRules);
    }
}

//Định nghĩa rules
//Nguyên tắc của các rules:
//1. Khi có lỗi => Trả ra message lỗi
//2. Khi ko có lỗi => Ko trả ra gì cả(undefined)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            //Khi người dùng nhập value trả ra undefined(.trim để phòng trg hợp ng dùng nhập dấu cách) 
            //Và trả ra cái message khi ng dùng ko nhập gì
            // return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
            return value ? undefined : message || 'Vui lòng nhập trường này';
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email'; //Kiểm tra value ng dùng nhập vào có phải là email hay ko? Nếu đúng trả về undefined còn nếu ko đúng thì TH ngc lại
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiếu ${min} kí tự`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'; //Nếu giá trị nhập vào bằng giá trị của hàm getConfirmValue thì trả về undefined & ngc lại
        }
    };
}