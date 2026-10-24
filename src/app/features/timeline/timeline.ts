import { Component } from '@angular/core';
import {SideLeft} from './side-left/side-left';
import {Posts} from './posts/posts';
import {SideRight} from './side-right/side-right';

@Component({
  imports: [SideLeft, Posts, SideRight],
  selector: 'app-timeline',
  styleUrl: './timeline.css',
  templateUrl: './timeline.html',
})
export class Timeline {}

