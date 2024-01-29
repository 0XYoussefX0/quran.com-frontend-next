import React from 'react';

import classNames from 'classnames';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

import styles from './LessonsList.module.scss';

import Card, { CardSize } from '@/dls/Card/Card';
import Link, { LinkVariant } from '@/dls/Link/Link';
import Pill from '@/dls/Pill';
import { Course } from '@/types/auth/Course';
import { logButtonClick } from '@/utils/eventLogger';
import {
  getCoursesNavigationUrl,
  getCourseNavigationUrl,
  getLessonNavigationUrl,
} from '@/utils/navigation';

type Props = {
  courses: Course[];
  isMyCourses: boolean;
};

const MIN_COURSES_COUNT = 6;

const CoursesList: React.FC<Props> = ({ courses, isMyCourses }) => {
  const { t } = useTranslation('learn');
  const onMyCourses = () => {
    logButtonClick('user_no_courses_link');
  };

  const onAllCoursesClicked = () => {
    logButtonClick('all_courses_link');
  };

  // if the user has no courses, show a message
  if (isMyCourses && courses.length === 0) {
    return (
      <span>
        <Trans
          i18nKey="learn:empty-knowledge-boosters"
          components={{
            link: (
              <Link
                onClick={onMyCourses}
                key={0}
                href={getCoursesNavigationUrl()}
                variant={LinkVariant.Blend}
              />
            ),
          }}
        />
      </span>
    );
  }

  let comingSoonCourses = [];
  // if we should put a coming soon placeholder
  if (!isMyCourses && courses.length < MIN_COURSES_COUNT) {
    // just fill the array with 0s
    comingSoonCourses = new Array(MIN_COURSES_COUNT - courses.length).fill(0);
  }

  return (
    <div>
      <div className={styles.container}>
        {courses.map((course) => {
          const { slug, id, continueFromLesson, title, isCompleted, thumbnail } = course;
          const navigateTo = continueFromLesson
            ? getLessonNavigationUrl(slug, continueFromLesson)
            : getCourseNavigationUrl(slug);
          return (
            <Card
              shouldShowFullTitle
              imgSrc={thumbnail}
              key={id}
              title={
                <Link href={navigateTo}>
                  <div className={styles.titleContainer}>
                    {title}
                    {isCompleted ? <Pill>{t('completed')}</Pill> : ''}
                  </div>
                </Link>
              }
              imgAlt={title}
              size={CardSize.Large}
              className={classNames(styles.cardContainer, styles.comingSoonContainer)}
            />
          );
        })}
        {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
        {comingSoonCourses.map((_, i) => {
          return (
            <Card
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              size={CardSize.Large}
              className={classNames(styles.cardContainer, styles.comingSoonContainer)}
              title={t('coming-soon')}
            />
          );
        })}
      </div>
      {isMyCourses && (
        <div className={styles.allCourses}>
          <Link
            variant={LinkVariant.Highlight}
            onClick={onAllCoursesClicked}
            href={getCoursesNavigationUrl()}
          >
            {t('all-knowledge-boosters')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
