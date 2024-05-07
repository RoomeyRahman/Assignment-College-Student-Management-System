import { SearchQueryDto } from '../../common/dto';

export class SearchStudentDto
    extends SearchQueryDto
    implements Readonly<SearchStudentDto>
{}
