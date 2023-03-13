
<template>
    <v-container>
        <v-responsive d-flex text-center>

            <v-row class="d-flex align-center justify-center ">
                <v-col cols="5" class="">

                    <v-sheet class=" py-15">
                        <h3 class="text-center">just tow step, you can make a xml file:</h3>
                    </v-sheet>
                    <v-sheet>First: upload a xlsx file about invoices information

                    </v-sheet>


                    <v-sheet max-width="400">
                        <v-file-input label="历史开票excel:" hint="历史开票excel"
                            @change="buyerAndGoodsInfoFileOpen($event)"></v-file-input>
                        <v-btn @click="readHistoryExcel">处理</v-btn>
                    </v-sheet>

                    <v-sheet max-width="400" class="my-15">
                        <v-file-input label="打开要开票的excel表:" hint="打开要开票的excel表"
                            @change="toBeOpenfileChange($event)"></v-file-input>
                        <v-btn @click="readToBeOpenExcel">处理</v-btn>
                        <v-text-field v-model="amountLimit" label="amountLimit"></v-text-field>
                        <v-text-field v-model="reviewer" label="reviewer"></v-text-field>
                        <v-text-field v-model="payee" label="payee"></v-text-field>
                    </v-sheet>

                    <v-sheet max-width="400">
                        <v-btn @click="downloadXml">下载xml</v-btn>
                    </v-sheet>


                <!-- 
                    <v-sheet class="">
                        First Step: <v-icon size="x-large" color="green" icon="mdi-check-circle"></v-icon>
                        </v-sheet> -->

                </v-col>

            </v-row>
        </v-responsive>

    </v-container>
</template>
 

<script setup>
import { ref } from 'vue'
import * as batch from './batchInvoiceScript'
import { saveAs } from 'file-saver'
const amountLimit = ref(100000)
const reviewer = ref('')
const payee = ref('')

//to be opne invoices
const toBeOpenInvoicesFile = ref(null)
const openInvoices = ref([])
function toBeOpenfileChange(event) {
    toBeOpenInvoicesFile.value = event.target.files[0]
    console.log(toBeOpenInvoicesFile.value)
}
async function readToBeOpenExcel() {
    let workbook = await batch.readFile(toBeOpenInvoicesFile.value)
    let rawInvoices = batch.parseInvoices(workbook, buyersMap.value, goodsMap.value)
    openInvoices.value = batch.splitInvoices(rawInvoices, amountLimit.value)
}

//buyer and goods info
const buyerAndGoodsInfoFile = ref(null)
const buyersMap = ref(new Map())
const goodsMap = ref(new Map())
function buyerAndGoodsInfoFileOpen(event) {
    buyerAndGoodsInfoFile.value = event.target.files[0]
    console.log(buyerAndGoodsInfoFile.value)
}
async function readHistoryExcel() {
    let rest = await batch.buyersAndGoodsInfo(buyerAndGoodsInfoFile.value)
    buyersMap.value = rest.buyers
    goodsMap.value = rest.goods
    console.log(buyersMap.value)
    console.log(goodsMap.value)
}



async function downloadXml() {
    let xmlStr = batch.invioceListXmlString(openInvoices.value, reviewer.value, payee.value).replaceAll("undefined", '').replaceAll("null", '')
    let blob = new Blob([xmlStr], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "invoices.xml");
}

</script>
 
<style lang="scss" scoped></style>