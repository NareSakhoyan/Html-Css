<template>
        <b-field>
            <b-select @input="func" :value="selectValue" placeholder="Choose..." :name="selectArrName">
                <option
                        v-for="(i, index) in selectList"
                        :value="`${i.value}.`"
                        :key="`${index}`">
                    {{i.value}}
                </option>
            </b-select>
            <b-input @input="func" :value="inputValue" :name="selectArrName"/>
        </b-field>
</template>

<script>
    export default {
        name: "inputValue",
        props: {
            value: {
                default: ''
            },
            selectValue: {
                default: ''
            },
            inputValue: {
                default: ''
            },
            selectArrName: {
                default: ''
            }
        },
        data() {
            return {
                finalValue: {}
            }
        },
        computed: {
            selectList() {
                return this.$store.state[this.selectArrName]
            },
        },
        methods: {
            func(e) {
                let val = e.target? e.target.value: e
                let len = val.length-1
                if (val.charAt(len)==='.') {
                    this.finalValue.attr = val.substring(0, len)
                }
                else{
                    this.finalValue.value = val
                }
                this.$emit('input', this.finalValue)
            },
        },
    }
</script>

<style scoped>

</style>