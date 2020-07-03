<template>
    <div class="homepage">
        <div class="container">
            <section v-if="isLoading">
                <b-loading :is-full-page=true :active.sync="isLoading"  :can-cancel="true"></b-loading>
            </section>
            <div class="columns">
                <div class="column is-4">
                    <form @submit="apply" v-if="!isLoading">
                        <b-field label="Html tags: " class="level-item">
                            <b-field name="htmlTag" @submit="setComponentData">
                                <b-select v-model="htmlTag" placeholder="Choose..." name="selectTag">
                                    <option
                                            v-for="(i, index) in tagNames"
                                            :value="i.id_tagNames"
                                            :key="`${index}`">
                                        {{i.value}}{{i.id_html_tag_value}}
                                    </option>
                                </b-select>
                                <b-input  v-model="htmlValue" name="tagValue" @blur="setComponentData"/>
                            </b-field>
                        </b-field>
                        <hr>

                        <b-field name="cssAttributes" label="Css attributes: " class="level-item">
                            <div class="cssAttributes">
                                <div v-for="(c, index) in css" :key="`css${index}`">
                                    <div class="cssAttribute" v-if="index===0">
                                        <inputValue v-model="c.value" :attributeIndex="css[0]" :cssAttribute="cssAttribute" :cssValue="cssValue" />
                                         <b-button @click="addAttribute" name="css" class="addBtn">Add</b-button><!--                        make that add button add new field and value-->
                                    </div>
                                    <div class="cssAttribute" v-else>
                                        <inputValue v-model="c.value" :attributeIndex="css[index]" :selectValue="cssAttribute" :inputValue="cssValue" selectArrName="cssAttributes"/>
                                        <b-button @click="removeAttribute(css[index].id)" name="css" class="removeBtn">Remove</b-button><!--                        make that add button add new field and value-->
                                    </div>
                                </div>
                            </div>
                        </b-field>
                        <hr>
                        <b-field label="Html attributes: " class="level-item">
                            <div id="htmlAttributes">
                                <div id="htmlAttributesIndex0">
                                    <b-field name="attribute">
                                        <b-select placeholder="Choose..." name="selectAttribute" @blur="setComponentData">
                                            <option
                                                    v-for="(i, index) in htmlAttributes"
                                                    :value="i.id_htmlAttributes"
                                                    :key="`${index}`">
                                                {{i.value}}
                                            </option>
                                        </b-select>
                                        <b-input name="attributeValue" @blur="setComponentData"/>
                                    </b-field>
                                </div>
                            </div>
                            <b-button @click="addAttribute" name="html" class="addBtn">Add</b-button>
                        </b-field>
                        <!--                        addHtmlAttribute-->
                        <b-button class="is-outlined is-success-passive apply level-item" >apply</b-button>
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
                css: [
                    {id: 0, value: {attr: '', value: ''}}
                ],
                htmlAttributes: [],
                attributeName: [],
                attributeValue: [],
                component: {
                    htmlTag: '',
                    htmlValue: '',//or it may be another htmltag
                    css: {},
                    attributes: {}
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
            addAttribute() {
                let index = this.css[this.css.length-1].id
                this.css.push({id: ++index, value: {}})
                console.log(
                    this.css
                )
            },
            removeAttribute(id) {
                this.css = this.css.filter(i => {
                    return i.id!==id
                })
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
    .cssAttribute {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .cssAttributes {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>