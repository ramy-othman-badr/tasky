import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';

@Component({
  selector: 'app-list-comp',
  templateUrl: './list-comp.component.html',
  styleUrls: ['./list-comp.component.scss'],
})
export class ListCompComponent implements OnInit {

  items = []
  default_value
  selected_value
  type
  list_title


  selected_items_length = 0
  min
  max

  constructor(public initService: InitService) { }

  ngOnInit() {
    if (this.type == 'multiple') {
      this.selected_items_length = 0
      for (var i in this.items) {
        this.items[i].checked = this.checkItem(this.items[i].id)
        if (this.items[i].checked) {
          this.selected_items_length ++
        }
      }
    }
  }

  checkItem(id) {
    let index = this.default_value.findIndex(elm => elm == id)
    if (index != -1) {
      return true
    } else {
      return false
    }
  }


  itemChange(event, itemIndex) {
    let count = 0
    for (var i in this.items) {
      if (this.items[i].checked) {
        count++
      }
    }
    this.selected_items_length = count
  }


  dismissModal() {
    this.initService.modalController.dismiss()
  }



  confirm() {
    if (this.type == 'single') {
      let index = this.items.findIndex(elm => elm.id == this.default_value)
      this.selected_value = this.items[index]
    } else {
      this.selected_value = []
      for (var i in this.items) {
        if (this.items[i].checked) {
          this.selected_value.push(this.items[i])
        }
      }
    }
    this.initService.modalController.dismiss({
      selected_value: this.selected_value
    })
  }




}
