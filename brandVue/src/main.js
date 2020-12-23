import Vue from "vue";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import querystring from "querystring";

axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

Vue.filter("dateFormat", function(dateStr, patten) {
    var date = new Date(dateStr);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    if (patten.toLowerCase() === "yyyy-mm-dd") {
        return `${year}-${month}-${day}`;
    } else {
        var hour = date.getHours().toString().padStart(2, "0");
        var minute = date.getMinutes().toString().padStart(2, "0");
        var second = date.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
});

Vue.directive("focus", {
    inserted(el) {
        el.focus();
    },
});

Vue.directive("color", {
    bind(el, binding) {
        el.style.color = binding.value;
    },
});

var vm = new Vue({
    el: "#app",
    data: {
        id: "",
        name: "",
        keywords: "",
        list: [],
    },
    created() {
        this.getBrandList();
    },
    methods: {
        async getBrandList() {
            let { data } = await axios.get("/api/getnewslist");
            if (data.status == 0) {
                this.list = data.message;
            }
        },
        async add() {
            if (this.id && this.name) {
                let { data } = await axios.post(
                    "/api/news/new",
                    querystring.stringify({
                        name: this.name,
                    })
                );
                if (data.status == 0) {
                    this.id = this.name = "";
                    this.$refs.idRef.focus();
                    this.getBrandList();
                }
            }
        },
        async del(id) {
            console.log(id)
            let { data } = await axios.get(`/api/news/del/${id}`);
            if (data.status === 0) {
                this.getBrandList();
            }
        },
    },
    computed: {
        search: function() {
            return this.list.filter((item) => {
                if (item.name.includes(this.keywords)) {
                    return true;
                }
            });
        },
    },
});