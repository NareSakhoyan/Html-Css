<template>
        <b-field>
            <b-select @input="func" :value="cssAttribute" placeholder="Choose..." name="selectCssAttribute">
                <option
                        v-for="(i, index) in cssAttributes"
                        :value="`${i.id_cssAttributes}.${cssAttributesIndex}`"
                        :key="`${index}`">
                    {{i.value}}
                </option>
            </b-select>
            <b-input @input="func" :value="cssValue" name="cssAttributeValue"/>
        </b-field>
</template>

<script>
    export default {
        name: "inputValue",
        props: {
            value: {
                default: ''
            },
            cssAttribute: {
                default: ''
            },
            cssValue: {
                default: ''
            },
        },
        data() {
            return {

            }
        },
        computed: {
            parentThis() {
                return this.$parent
            },
            cssAttributes() {
                return this.$store.state.cssAttributes
            },
        },
        methods: {
            func(e) {
                //gets button text or span text
                this.$emit('input', e.target? e.target.value: e)
            },
        },
    }
</script>

<style scoped>

</style>