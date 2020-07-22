<template>
    <div class="homepage">
        <div class="container">
           <div class="settings">
               <section v-if="isLoading">
                   <b-loading :is-full-page=true :active.sync="isLoading"  :can-cancel="true"></b-loading>
               </section>
               <div class="columns">
                   <div class="column is-4">
                       <form v-if="!isLoading">

                           <b-field label="Html tags: " class="level-item labelTopFixed">
                               <b-field name="htmlTag" @submit="setComponentData">
                                   <inputValue v-model="htmlTag" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="tagNames"/>
                               </b-field>
                           </b-field>

                           <hr>

                           <b-field name="cssAttributes" label="Css attributes: " class="level-item labelTopFixed">
                               <div class="cssAttributes">
                                   <div v-for="(c, index) in component.css" :key="`css${c.id}`">
                                       <div class="cssAttribute" v-if="index===0">
                                           <inputValue v-model="c.value" :attributeIndex="component.css[0]" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="cssAttributes"/>
                                           <b-button @click="addAttribute(component.css)" name="css" class="addBtn">Add</b-button>
                                       </div>
                                       <div class="cssAttribute" v-else>
                                           <inputValue v-model="c.value" :attributeIndex="c" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="cssAttributes"/>
                                           <b-button @click="removeAttribute(c.id, 'css')" name="css" class="removeBtn">Remove</b-button>
                                       </div>
                                   </div>
                               </div>
                           </b-field>

                           <hr>

                           <b-field label="Html attributes: " class="level-item labelTopFixed">
                               <div class="htmlAttributes">
                                   <div v-for="(attr, index) in component.attributes" :key="`attr${attr.id}`">
                                       <div class="htmlAttribute" v-if="index===0">
                                           <inputValue v-model="attr.value" :attributeIndex="component.attributes[0]" :selectValue="htmlAttribute" :inputValue="htmlAttributeValue" selectArrName="htmlAttributes"/>
                                           <b-button @click="addAttribute(component.attributes)" name="css" class="addBtn">Add</b-button>
                                       </div>
                                       <div class="htmlAttribute" v-else>
                                           <inputValue v-model="attr.value" :attributeIndex="attr" :selectValue="htmlAttribute" :inputValue="htmlAttributeValue" selectArrName="htmlAttributes"/>
                                           <b-button @click="removeAttribute(attr.id, 'attributes')" name="css" class="removeBtn">Remove</b-button>
                                       </div>
                                   </div>
                               </div>
                           </b-field>
                           <b-button class="is-outlined is-success-passive apply level-item" @click="apply">Apply</b-button>
                       </form>
                   </div>
               </div>
           </div>
            <div id="element">

            </div>
        </div>
        <hr>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import inputValue from "../components/inputValue";
    import Vue from 'vue'
    // import saveDataForDb from "../utils/saveDataForDb";
    // import store from "../store/store";

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
                let index = arr[arr.length-1].id
                arr.push({id: ++index, value: {}})
            },
            removeAttribute(id, str) {
                this.component[str] = this.component[str].filter(i => i.id!==id)

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
                this.generateHtmlComponent(this.component)
                this.saveDataForDb({...this.component})
                console.log( 444, this.getCode()('tagNames', 'input'));
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
            generateHtmlComponent(details) {
                let elem = document.getElementsByClassName('container')[0]
                let div = document.createElement('div')
                div.setAttribute('id', 'element')
                elem.removeChild(elem.lastChild)
                elem.appendChild(div)
                function getObject(arr) {
                    const obj = {}
                    for (let i in arr) {
                        let tmp = arr[i].value
                        obj[tmp['attr']] = tmp['value']
                    }
                    return obj
                }
                // function objectToString(obj, type) {
                //     const objKeys = Object.keys(obj)
                //     const forCss = type==='css'
                //     let str = forCss? '{': ''
                //     for (let i in objKeys) {
                //         let key = objKeys[i]
                //         str += `${key}: ${obj[key]}${forCss? ';': ','} `
                //     }
                //     str += forCss? '}': ''
                //     return str
                // }
                const {attributes, css, htmlTag} = details
                const {attr, value} = htmlTag
                const attributesObject = getObject(attributes)
                const cssObject = getObject(css)
                // const cssValue = objectToString(cssObject, 'css')
                const classValue =  [].concat(attributesObject['class'])
                let vm = new Vue( {
                    data: {
                        htmlTag: attr,
                        htmlValue: value,
                        attrs: attributesObject,
                        styles: cssObject,
                        class: classValue,
                    },
                    render(createElement) {
                        return createElement(
                            this.htmlTag,
                            {   style: this.styles,
                                class: this.class,
                                attrs: this.attrs,
                                domProps: {
                                    innerHTML: this.htmlValue || 'error'
                                },
                            },
                        );
                    },
                    mounted() {
                        console.log('mounted')
                    }
                });
                vm.$mount(div)
            },
            async saveDataForDb(data){
                console.log('Data: ', data);
                const {attributes, css, htmlTag} = data
                const {attr, value} = htmlTag
                const thisThis = this
                console.log(0, attributes, css, htmlTag, attr, value);
                // let codedData = {
                //     'htmlTag'։ this.getCode()('tagNames', attr),
                //     'attrs'։ this.getCode()('tagNames', attr),
                // }
                // let cssKeys = Object.keys(css)
                const cssIds = await createIdsArr('css')
                const attributesIds = await createIdsArr('attributes')

                let response = (await this.$api.post(`/html`, {data: {tagName: attr, tagValue: value, cssIds: JSON.stringify(cssIds), attributesIds: JSON.stringify(attributesIds)}}))
                console.log('response: ', response);


                async function createIdsArr(objName) {
                    const ids = []
                    const obj = data[objName]
                    for (let i in obj) {
                        // let key = cssKeys[i]
                        let attribute = obj[i];
                        let value = attribute.value.value
                        let attr = attribute.value.attr
                        //get attribute code from store
                        let attrId = thisThis.getCode()(objName==='css'? 'css': 'ht  ' +
                            'mlAttributes', attr)
                        //add value in db
                        let response = (await thisThis.$api.post(`/${objName}/attributes/value`, {data: {valueId: value}})).data
                        //get value id
                        const valueId = response.insertId
                        //add whole css in db
                        response = (await thisThis.$api.post(`/${objName}/value`, {data: {valueId, attrId}})).data
                        const id = response.insertId
                        ids.push(id)
                    }
                    return ids
                }

            }
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
    .container {
        margin-top: 50px;
    }
</style>