<template>
    <div class="homepage">
        <div class="container">
            <section v-if="isLoading">
                <b-loading :is-full-page=true :active.sync="isLoading"  :can-cancel="true"></b-loading>
            </section>
            <div class="columns">
                <div class="column is-4">
                    <form @submit="apply" v-if="!isLoading">

                        <b-field label="Html tags: " class="level-item labelTopFixed">
                            <b-field name="htmlTag" @submit="setComponentData">
                                <inputValue v-model="htmlTag" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="tagNames"/>
                            </b-field>
                        </b-field>

                        <hr>

                        <b-field name="cssAttributes" label="Css attributes: " class="level-item labelTopFixed">
                            <div class="cssAttributes">
                                <div v-for="(c, index) in component.css" :key="`css${index}`">
                                    <div class="cssAttribute" v-if="index===0">
                                        <inputValue v-model="c.value" :attributeIndex="component.css[0]" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="cssAttributes"/>
                                         <b-button @click="addAttribute(component.css)" name="css" class="addBtn">Add</b-button>
                                    </div>
                                    <div class="cssAttribute" v-else>
                                        <inputValue v-model="c.value" :attributeIndex="c" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="cssAttributes"/>
                                        <b-button @click="removeAttribute(c.id, component.css)" name="css" class="removeBtn">Remove</b-button>
                                    </div>
                                </div>
                            </div>
                        </b-field>

                        <hr>

                        <b-field label="Html attributes: " class="level-item labelTopFixed">
                            <div class="htmlAttributes">
                                <div v-for="(attr, index) in component.attributes" :key="`attr${index}`">
                                    <div class="htmlAttribute" v-if="index===0">
                                        <inputValue v-model="attr.value" :attributeIndex="component.attributes[0]" :selectValue="htmlAttribute" :inputValue="htmlAttributeValue" selectArrName="htmlAttributes"/>
                                        <b-button @click="addAttribute(component.attributes)" name="css" class="addBtn">Add</b-button>
                                    </div>
                                    <div class="htmlAttribute" v-else>
                                        <inputValue v-model="attr.value" :attributeIndex="attr" :selectValue="htmlAttribute" :inputValue="htmlAttributeValue" selectArrName="htmlAttributes"/>
                                        <b-button @click="removeAttribute(attr.id, component.attributes)" name="css" class="removeBtn">Remove</b-button>
                                    </div>
                                </div>
                            </div>
                        </b-field>
                        <b-button class="is-outlined is-success-passive apply level-item" >Apply</b-button>
                    </form>
                </div>
            </div>
        </div>
        <hr>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import inputValue from "../components/inputValue";

    export default {
        name: "HomePage",
        components: {
            inputValue
        },
        data() {
            return {
                htmlAttributesIndex: 1,
                methodNumber: 0,
                needToBeCalled: [
                    ['/html', 'tagNames'],
                    ['/html/attributes', 'htmlAttributes'],
                    ['/html/values', 'cssValues'],
                    ['/css/attributes', 'cssAttributes'],
                    ['/css/values', 'cssValues'],
                ],
                arrName: '',
                tagNames: [],
                cssAttributes: [],
                cssValues: [],
                htmlAttributes: [],
                attributeName: [],
                attributeValue: [],
                component: {
                    htmlTag: '',
                    htmlValue: '',//or it may be another htmltag
                    css: [
                        {id: 0, value: {attr: '', value: ''}}
                    ],
                    attributes: [
                        {id: 0, value: {attr: '', value: ''}}
                    ],
                }
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.isLoading
            },
            htmlTag: {
                get() {
                    return this.component.htmlTag
                },
                set(value) {
                    this.component.htmlTag = value;
                }
            },
            htmlValue: {
                get() {
                    return this.component.htmlValue
                },
                set(value) {
                    console.log(13465, value)
                    this.component.htmlValue = value
                }
            },
            cssAttribute: {
                get() {
                    return 'Choose...'
                },
                set(value) {
                    let arr = value.split('.')
                    let x = this.component.css[arr[1]] = {}
                    x[arr[0]] = ''
                }
            },
            cssValue: {
                get() {
                    return ''
                },
                set(value) {
                    this.component.htmlValue = value
                }
            },
            htmlAttribute: {
                get() {
                    return 'Choose...'
                },
                set(value) {
                    let arr = value.split('.')
                    let x = this.component.attributes[arr[1]] = {}
                    x[arr[0]] = ''
                }
            },
            htmlAttributeValue: {
                get() {
                    return ''
                },
                set(value) {
                    this.component.htmlValue = value
                }
            }
        },
        watch: {
            isLoading(to, from) {
                if (from && !to){//time when data is loading
                    this[this.arrName] = JSON.parse(JSON.stringify(this.$store.state[this.arrName]))
                    if (this.methodNumber !== this.needToBeCalled.length) {
                        this.getData()
                    }
                }
            },
        },
        methods: {
            ...mapActions(['setDataUrl', 'setDataArrName', 'getDataFromApi']),
            ...mapGetters(['getCode']),
            addAttribute(arr) {
                console.log(798, arr);
                let index = arr[arr.length-1].id
                arr.push({id: ++index, value: {}})
                console.log(
                    arr
                )
            },
            removeAttribute(id, attr) {
                console.log(111111111, attr, id)
                attr = attr.filter(i => {
                    if(i.id!==id) {
                        console.log(i)
                    }
                    return i.id!==id
                })
                this.$forceUpdate()
                console.log(attr);
            },
            setComponentData(elem) {
                let value = elem.target.value
                if (!value) return;

                let name = elem.target.name
                console.log(name, value)
                // if (name.substr(0, 6) === 'select') {
                //     let arrName = name === 'cssAttributeValue'? 'css': 'attributes';
                //     this.component[arrName]
                // } else {
                //     if (name === 'tagValue') {//make work for new html element
                //         this.component['tagValue'] = value
                //     } else {//get property code
                //         let arrName = name === 'cssAttributeValue'? 'css': 'attributes';
                //         this.component[arrName].push({name: value})
                //         this.getCode(arrName, )
                //     }
                // }
                console.log(elem.target)
                // if (name === 'tagValue') {//make work for new html element
                //     this.component['tagValue'] = value
                // } else {//get property code
                //     let arrName = name === 'cssAttributeValue'? 'css': 'attributes';
                //     this.component[arrName].push({name: value})
                //     this.getCode(arrName, )
                // }
                console.log('this.component: ', this.component)
            },
            apply() {
                // this.component: {
                //     htmlTag: '',
                //         htmlValue: '',//or it may be another htmltag
                //         css: [],
                //         attributes: []
                // }
            },
            getData() {
                let currentCall = this.needToBeCalled[this.methodNumber]
                let url = currentCall[0]
                let arrName = currentCall[1]
                this.setDataUrl(url)
                this.setDataArrName(arrName)
                this.getDataFromApi()
                this.arrName = arrName
                ++this.methodNumber
            },
        },
        mounted() {
            this.getData()
        },
    }
</script>

<style scoped>
    .apply {
        margin: 0 0 0 20px;
    }
    .addBtn {
        margin: 0 -30px 0 0 ;
    }
    .removeBtn {
        margin: 0 -57px 0 0;
    }
    .cssAttribute, .htmlAttribute {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .cssAttributes, .htmlAttributes {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .labelTopFixed {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
</style>